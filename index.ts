import type { MiddlewareConsumer } from '@nestjs/common';
import type { Request, Response } from 'express';

import { kofiHandler } from '@ko-fi/handler';
import { Config, mergeConfig } from '@ko-fi/types';
import { RequestMethod } from '@nestjs/common/enums';

const handler = (config: Config<Request>) => async (req: Request, res: Response) => {
    const { data } = req.body as { data: string; };
    const status = await kofiHandler(data, config, req);

    res.sendStatus(status);
};

export const kofi = (consumer: MiddlewareConsumer, config?: Partial<Config<Request>>) => {
    const conf = mergeConfig(config);

    consumer
        .apply(handler(conf))
        .forRoutes({ path: conf.endpoint, method: RequestMethod.POST });
};
