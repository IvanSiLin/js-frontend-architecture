const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { setMaxListeners } = require('events');

const isProduction = process.env.NODE_ENV == 'production';

const api = (middlewares, devServer) => {
        
        const task1 = { name: 'Первая задача' };
        const task2 = { name: 'Вторая задача' };
        data = { items: [task2, task1] };
    
        devServer.app.get("/api/tasks", function(req, res) {

            res.json(data);

        });

        devServer.app.post("/api/tasks", function(req, res) {

            data.items.unshift(req.body);
            
            res.status(201).json({ message: 'Success!' });
            
        });

      };

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        open: true,
        host: 'localhost',
        setupMiddlewares: (middlewares, devServer) => {
            if (!devServer) {
              throw new Error("webpack-dev-server is not defined");
            }
      
            const task1 = { name: 'Первая задача' };
            const task2 = { name: 'Вторая задача' };
            let data = { items: [task2, task1] };

            devServer.app.get("/api/tasks", (req, res) => {
              res.json(data);
            });

            devServer.app.post("/api/tasks", function(req, res) {

                data.items.unshift(req.body);
                res.status(201).json({ message: 'Success!' });
            });
            
            return middlewares;
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),

    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};
