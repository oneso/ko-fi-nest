Ko-fi webhook handler for NestJS.

For more informations visit https://ko-fi.com/manage/webhooks

---

## Installation

### npm

`npm install @ko-fi/nest`

### yarn

`yarn add @ko-fi/nest`

## Example

View example implementation [here](https://github.com/oneso/ko-fi-nest-example);

Example app.module.ts:

    import { kofi } from '@ko-fi/nest';
    import { MiddlewareConsumer, Module } from '@nestjs/common';

    import { AppController } from './app.controller';
    import { AppService } from './app.service';

    @Module({
      imports: [],
      controllers: [AppController],
      providers: [AppService],
    })
    export class AppModule {
      configure(consumer: MiddlewareConsumer) {
        kofi(consumer, {
          onData: (data, req) => {
            console.log('onData called');
          },
          onCommission: (data, req) => {
            console.log('onCommission called');
          },
          onDonation: (data, req) => {
            console.log('onDonation called');
          },
          onShopOrder: (data, req) => {
            console.log('onShopOrder called');
          },
          onSubscription: (data, req) => {
            console.log('onSubscription called');
          },
        });
      }
    }
