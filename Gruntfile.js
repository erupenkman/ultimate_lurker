'use strict';
module.exports = function(grunt) {
    // Show elapsed time at the end
    require('time-grunt')(grunt);
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks("grunt-nodemon");


    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                src: ['Gruntfile.js']
            },
            js: {
                src: ['*.js']
            },
            test: {
                src: ['test/**/*.js']
            }
        },
        mochacli: {
            options: {
                reporter: 'nyan',
                bail: true
            },
            all: ['test/*.js']
        },
        nodemon: {
            dev: {
                script: 'index.js',
                options: {
                    /** Environment variables required by the NODE application **/
                    env: {
                        "NODE_ENV": "development",
                        "NODE_CONFIG": "dev"
                    },
                    watch: ["server"],
                    nodeArgs: ['--debug'],
                    delay: 300,

                    callback: function(nodemon) {
                        nodemon.on('log', function(event) {
                            console.log(event.colour);
                        });


                        /** Update .rebooted to fire Live-Reload **/
                        nodemon.on('restart', function() {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('fs').writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
                }
            }
        },

        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            js: {
                files: '<%= jshint.js.src %>',
                tasks: ['jshint:js', 'mochacli']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'mochacli']
            }
        }
    });

    grunt.registerTask('test', ['jshint', 'mochacli']);
    grunt.registerTask('default', ['jshint', 'mochacli']);
};
