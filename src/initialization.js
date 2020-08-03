var optimizelyEvents = require('./optimizely-defined-events');
var optimizelyFullStackEvents = require('./optimizely-fs-defined-events');
var helpers = require('./helpers');

var initialization = {
    name: 'Optimizely',
    moduleId: 54,
    initForwarder: function(settings, testMode, userAttributes, userIdentities, processEvent, eventQueue, isInitialized) {
        if (!testMode) {
            if (!window.optimizely) {
                var optimizelyScript = document.createElement('script');
                optimizelyScript.type = 'text/javascript';
                optimizelyScript.async = true;
                optimizelyScript.src = 'https://cdn.optimizely.com/js/' + settings.projectId + '.js';
                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(optimizelyScript);
                optimizelyScript.onload = function() {
                    isInitialized = true;

                    loadEventsAndPages();

                    if (window['optimizely'] && eventQueue.length > 0) {
                        for (var i = 0; i < eventQueue.length; i++) {
                            processEvent(eventQueue[i]);
                        }
                        eventQueue = [];
                    }
                };
            } else {
                isInitialized = true;
                loadEventsAndPages();
            }
            if (!window.optimizelyClientInstance) {
                var loadScript = src => {
                    return new Promise((resolve, reject) => {
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.onload = resolve;
                        script.onerror = reject;
                        script.src = src;
                        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
                    })
                }

                loadScript('https://unpkg.com/@optimizely/optimizely-sdk/dist/optimizely.browser.umd.min.js')
                    .then(() => loadScript('https://cdn.optimizely.com/datafiles/' + settings.sdkKey + '.json/tag.js'))
                    .then(() => {
                        // Instantiate Optimizely Full Stack Client
                        var optimizelyClientInstance = window.optimizelySdk.createInstance({
                        datafile: window.optimizelyDatafile
                        });

                        optimizelyClientInstance.onReady().then(() => {
                            isInitialized = true;
                            loadFullStackEvents();
                        });                       
                    })
                    .catch(() => console.log('Something went wrong.'))
            } else {
                isInitialized = true;
                loadFullStackEvents();
            }            
        } else {
            isInitialized = true;
            loadEventsAndPages();
            loadFullStackEvents();
        }
    }
};

function loadEventsAndPages() {
    var data,
        events = {},
        pages = {};

    if (window.optimizely) {
        data = window.optimizely.get('data');

        for (var event in data.events) {
            events[data.events[event].apiName] = 1;
        }

        for (var page in data.pages) {
            pages[data.pages[page].apiName] = 1;
        }

        optimizelyEvents.events = events;
        optimizelyEvents.pages = pages;
    }
}

function loadFullStackEvents() {
    var fullStackData,
    fullStackEvents = {};

    if (window.optimizelyDatafile) {
        fullStackData = helpers.arrayToObject(window.optimizelyDatafile.events, "id");

        for (var event in fullStackData) {
            fullStackEvents[fullStackData[event].key] = 1;
        }

        optimizelyFullStackEvents.events = fullStackEvents;
    }
}

module.exports = initialization;
