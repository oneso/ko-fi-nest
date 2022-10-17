import type { MiddlewareConsumer } from '@nestjs/common';
import type { Request, Response } from 'express';

import { CommissionData, DonationData, RequestData, ShopOrderData, SubscriptionData, Type } from '@ko-fi/types';
import { RequestMethod } from '@nestjs/common/enums';

const defaultConfig: Config = {
    endpoint: 'webhook',
    onData: () => null,
    onCommission: () => null,
    onDonation: () => null,
    onShopOrder: () => null,
    onSubscription: () => null,
    onError: () => null,
    verificationToken: false,
};

const kofiHandler = (config: Config) => async (req: Request, res: Response) => {
    const { data } = req.body as { data: string; };

    try {
        const parsed: RequestData = JSON.parse(data);

        if (config.verificationToken && parsed.verification_token !== config.verificationToken) {
            console.error('Ko-fi invalid verification token');
            return res.sendStatus(401);
        }

        await config.onData?.(parsed, req);

        switch (parsed.type) {
            case Type.Commission:
                await config.onCommission?.(parsed, req);
                break;
            case Type.Donation:
                await config.onDonation?.(parsed, req);
                break;
            case Type.ShopOrder:
                await config.onShopOrder?.(parsed, req);
                break;
            case Type.Subscription:
                await config.onSubscription?.(parsed, req);
                break;
        }
    } catch (err) {
        console.error('Ko-fi request error: ', err);
        config.onError?.(req);

        return res.sendStatus(400);
    }

    res.sendStatus(200);
};

export const kofi = (consumer: MiddlewareConsumer, config?: Partial<Config>) => {
    const conf = { ...defaultConfig, ...config };

    consumer
        .apply(kofiHandler(conf))
        .forRoutes({ path: conf.endpoint, method: RequestMethod.POST });
};

export interface Config {
    endpoint: string;
    onData: Callback<RequestData>;
    onCommission: Callback<CommissionData>;
    onDonation: Callback<DonationData>;
    onShopOrder: Callback<ShopOrderData>;
    onSubscription: Callback<SubscriptionData>;
    onError: (req: Request) => void;
    verificationToken: string | false;
}

export type Callback<TData> = (data: TData, req: Request) => void | null | undefined | Promise<void>;
