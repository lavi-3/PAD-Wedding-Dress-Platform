import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import { create, order, giveOrder } from './controllers/LoverController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, 'lover.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const loverProto = grpc.loadPackageDefinition(packageDefinition).lover;

const LoverService = {

    OrderLover: async (call, callback) => {
        try {
            const req = { body: call.request };
            const res = {
                json: (data) => {
                    callback(null, {
                        _id: data._id,
                        dress: data.dress,
                        material: data.material,
                        price: data.price,
                        date: data.date
                    });
                },
                status: (statusCode) => ({
                    json: (data) => callback({
                        code: grpc.status.INTERNAL,
                        message: data.message,
                    })
                }),
            };
            await order(req, res);
        } catch (error) {
            console.error(error);
            callback({
                code: grpc.status.INTERNAL,
                message: 'Error creating order',
            });
        }
    },

};

// Create and start the gRPC server using @grpc/grpc-js
function startGrpcServer() {
    const server = new grpc.Server();
    server.addService(loverProto.LoverService.service, LoverService);
    server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log('gRPC server running at http://127.0.0.1:50051');
        server.start();
    });
}

export default startGrpcServer;
