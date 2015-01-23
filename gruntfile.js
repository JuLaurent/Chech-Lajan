"use strict";

module.exports = function( grunt ) {

    grunt.loadNpmTasks( "grunt-browserify" );
    grunt.loadNpmTasks( "grunt-contrib-uglify" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );

    var aBrowserifyLibs = [
        "fastclick",
        "jquery",
        "underscore",
        "backbone",
        "jeolok",
        "jeyo-distans"
    ];

    grunt.initConfig( {
        "browserify": {
            "libs": {
                "options": {
                    "require": aBrowserifyLibs
                },
                "src": [],
                "dest": "static/js/libs.js"
            },
            "app": {
                "options": {
                    "external": aBrowserifyLibs
                },
                "files": {
                    "static/js/app.js": "client/app.js",
                    "static/js/admin.js": "admin/admin.js"
                }
            }
        },
        "uglify": {
            "options": {
                "sourceMap": true // REMOVE BEFORE FLIGHT
            },
            "libs": {
                "files": {
                    "static/js/libs.min.js": "static/js/libs.js"
                }
            },
            "app": {
                "files": {
                    "static/js/app.min.js": "static/js/app.js",
                    "static/js/admin.min.js": "static/js/admin.js"
                }
            }
        },
        "watch": {
            "app": {
                "files": [ "client/**/*.js" ],
                "options": {
                    "spawn": false,
                    "livereload": true
                },
                "tasks": [
                    "browserify:app",
                    "uglify:app"
                ]
            }
        }
    } );

    grunt.registerTask( "default", [
        "browserify",
        "uglify"
    ] );

    grunt.registerTask( "work", [
        "default",
        "watch"
    ] );

};
