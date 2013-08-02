/*global module:true*/

module.exports = function(grunt) {'use strict';

    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        meta: {
            banner:'/*! sjs v<%= pkg.version %> sjs */'
        },
        concat: {
            options: {
                stripBanners:true,
                banner:'/*! <%= pkg.name %> - v<%= pkg.version %> - '+'<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            browser: {
                src:['src/scode/init.js','src/scode/metric.js','src/scode/model.js', 'src/scode/scrollbar.js', 'src/scode/ui.js', 'src/scode/api.js'],
                dest:'dist/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        uglify: {
            browser: {
                files: {
                    'dist/<%= pkg.name %>-<%= pkg.version %>.min.js':['dist/<%= pkg.name %>-<%= pkg.version %>.js']
                }
            },

        },
        watch: {
            files:['src/**/*.js','test/**/*.js'],
            tasks:['concat','jshint']
        },

        jshint: {
            files:['grunt.js','src/scode/*.js'],
            options: {
                curly:true,
                eqeqeq:true,
                immed:true,
                latedef:true,
                newcap:false,
                noarg:true,
                sub:true,
                undef:true,
                boss:true,
                eqnull:true,
                wsh:true,
                browser:true,
                globals: {
                    scode:true,
                    console:true
                }
            }
        }        
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default',['concat','jshint','uglify']);

};

