'use strict';
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var provenanceConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        provenance: provenanceConfig,
        watch: {
            options: {
                spawn: false
            },
            coffee: {
                files: ['<%= provenance.app %>/js/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            compass: {
                files: ['<%= provenance.app %>/css/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= provenance.dist %>/*',
                        '!<%= provenance.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.options.port %>/index.html']
                }
            }
        },
        coffee: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= provenance.app %>/js',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/js',
                    ext: '.js'
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: 'test/spec',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/spec',
                    ext: '.js'
                }]
            }
        },
        compass: {
            options: {
                sassDir: '<%= provenance.app %>/css',
                cssDir: '.tmp/css',
                generatedImagesDir: '.tmp/imgs/generated',
                imagesDir: '<%= provenance.app %>/imgs',
                javascriptsDir: '<%= provenance.app %>/js',
                fontsDir: '<%= provenance.app %>/css/fonts',
                importPath: '<%= provenance.app %>/bower_components',
                httpImagesPath: '/imgs',
                httpGeneratedImagesPath: '/imgs/generated',
                relativeAssets: false
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        // not enabled since usemin task does concat and uglify
        // check index.html to edit your build targets
        // enable this task if you prefer defining your build targets here
        /*uglify: {
            dist: {}
        },*/
        useminPrepare: {
            options: {
                dest: '<%= provenance.dist %>'
            },
            html: [
                '<%= provenance.app %>/popup.html',
                '<%= provenance.app %>/options.html'
            ]
        },
        usemin: {
            options: {
                dirs: ['<%= provenance.dist %>']
            },
            html: ['<%= provenance.dist %>/{,*/}*.html'],
            css: ['<%= provenance.dist %>/css/{,*/}*.css']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= provenance.app %>/imgs',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= provenance.dist %>/imgs'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= provenance.app %>/imgs',
                    src: '{,*/}*.svg',
                    dest: '<%= provenance.dist %>/imgs'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= provenance.dist %>/css/main.css': [
                        '.tmp/css/{,*/}*.css',
                        '<%= provenance.app %>/css/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/provenance/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= provenance.app %>',
                    src: '*.html',
                    dest: '<%= provenance.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= provenance.app %>',
                    dest: '<%= provenance.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        'imgs/{,*/}*.{webp,gif}',
                        '_locales/{,*/}*.json'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/imgs',
                    dest: '<%= provenance.dist %>/imgs',
                    src: [
                        'generated/*'
                    ]
                }]
            }
        },
        concurrent: {
            server: [
                'coffee:dist',
                'compass:server'
            ],
            test: [
                'coffee',
                'compass'
            ],
            dist: [
                'coffee',
                'compass:dist',
                'svgmin',
                'htmlmin'
            ]
        },
        chromeManifest: {
            dist: {
                options: {
                    buildnumber: true,
                    background: {
                        target:'js/background.js'
                    }
                },
                src: '<%= provenance.app %>',
                dest: '<%= provenance.dist %>'
            }
        },
        compress: {
            dist: {
                options: {
                    archive: 'package/provenance.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**'],
                    dest: ''
                }]
            }
        }
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'chromeManifest:dist',
        'useminPrepare',
        'concurrent:dist',
        'cssmin',
        'concat',
        // 'uglify',
        'copy',
        'usemin',
        'compress'
    ]);

    grunt.registerTask('default', [
        // 'test',
        'build'
    ]);
};
