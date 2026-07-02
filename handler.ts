import commonHandler from './bin/handler/commonHandler';

const handlers = (options: any) => {
    console.log("[ShazaM] Handlers Activated");

    commonHandler(options, 'Global Error', 'uncaughtException');
    commonHandler(options, 'Promise Error', 'unhandledRejection');
};

export default handlers;