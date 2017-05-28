/**
 * @description grunt 配置
 *
 **/

'use strict';

var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

var webpackDistConfig = require('./webpack.dist.config.js'),
    webpackDevConfig = require('./webpack.config.js');

module.exports = function (grunt) {
    // Let *load-grunt-tasks* require everything
    require('load-grunt-tasks')(grunt);

    // Read configuration from package.json
    var pkgConfig = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkgConfig,

        webpack: {
            options: webpackDistConfig,
            dist   : {
                cache: false
            }
        },

        'webpack-dev-server': {
            options: {
                historyApiFallback: true,
                hot    : true,
                port   : 8000,
                webpack: webpackDevConfig,
                contentBase: './<%= pkg.src %>/'
            },

            start: {
                keepAlive: true
            }
        },

        connect: {
            options: {
                hostname: 'localhost',
                port    : 8000
            },

            dist: {
                options: {
                    keepalive : true,
                    open      : true,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, pkgConfig.dist)
                        ];
                    }
                }
            }
        },

        open: {
            options: {
                delay: 500
            },
            dev    : {
                path: 'http://localhost:<%= connect.options.port %>'
            },
            dist   : {
                path: 'http://localhost:<%= connect.options.port %>/'
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments    : true,
                    collapseWhitespace: true
                },
                files  : {
                    'dist/index.html': 'dist/assets/index.html',
                    'dist/404.html': 'dist/assets/404.html'
                }
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= pkg.dist %>'
                    ]
                }]
            }
        },
        copy : {
            main: {
                files: [{
                    expand: true,
                    cwd   : "src",
                    src   : "vendor/**",
                    dest  : "./dist"
                },
                    {
                        expand: true,
                        cwd   : "src",
                        src   : "qq/**",
                        dest  : "./dist"
                    },{
                        expand: true,
                        cwd   : "src",
                        src   : "wb/**",
                        dest  : "./dist"
                    },
                    {
                        expand: true,
                        cwd   : "src",
                        src   : "views/**/**",
                        dest  : "./dist"
                    },{
                        expand: true,
                        cwd   : "src",
                        src   : "icons/**",
                        dest  : "./dist"
                    }]
            }
        }
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open:dist', 'connect:dist']);
        }

        grunt.task.run([
            'open:dev',
            'webpack-dev-server'
        ]);
    });

    grunt.registerTask('build', ['clean', 'webpack', 'htmlmin', 'copy']);

    grunt.registerTask('default', []);
};
