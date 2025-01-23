jQuery(function()
{
    initAccordion()
});
function initAccordion()
{
    jQuery('.sec-lvl').slideAccordion({
        opener: '.inner-opener2', slider: '.inner-dropmenu', animSpeed: 300
    })
}
;
(function(root, factory)
{
    'use strict';
    if (typeof define === 'function' && define.amd)
    {
        define(['jquery'], factory)
    }
    else if (typeof exports === 'object')
    {
        module.exports = factory(require('jquery'))
    }
    else
    {
        root.SlideAccordion = factory(jQuery)
    }
}(this, function($)
{
    'use strict';
    var accHiddenClass = 'js-acc-hidden';
    function SlideAccordion(options)
    {
        this.options = $.extend(true, {
            allowClickWhenExpanded: false, activeClass: 'active', opener: '.opener', slider: '.slide', animSpeed: 300, collapsible: true, event: 'click', scrollToActiveItem: {
                    enable: false, breakpoint: 767, animSpeed: 600, extraOffset: null
                }
        }, options);
        this.init()
    }
    SlideAccordion.prototype = {
        init: function()
        {
            if (this.options.holder)
            {
                this.findElements();
                this.setStateOnInit();
                this.attachEvents();
                this.makeCallback('onInit')
            }
        }, findElements: function()
            {
                this.$holder = $(this.options.holder).data('SlideAccordion', this);
                this.$items = this.$holder.find(':has(' + this.options.slider + ')')
            }, setStateOnInit: function()
            {
                var self = this;
                this.$items.each(function()
                {
                    if (!$(this).hasClass(self.options.activeClass))
                    {
                        $(this).find(self.options.slider).addClass(accHiddenClass)
                    }
                })
            }, attachEvents: function()
            {
                var self = this;
                this.accordionToggle = function(e)
                {
                    var $item = jQuery(this).closest(self.$items);
                    var $actiItem = self.getActiveItem($item);
                    if (!self.options.allowClickWhenExpanded || !$item.hasClass(self.options.activeClass))
                    {
                        e.preventDefault();
                        self.toggle($item, $actiItem)
                    }
                };
                $('#header .sec-lvl .inner-opener2').click(this.accordionToggle)
            }, toggle: function($item, $prevItem)
            {
                if (!$item.hasClass(this.options.activeClass))
                {
                    this.show($item)
                }
                else if (this.options.collapsible)
                {
                    this.hide($item)
                }
                if (!$item.is($prevItem) && $prevItem.length)
                {
                    this.hide($prevItem)
                }
                this.makeCallback('beforeToggle')
            }, show: function($item)
            {
                var $slider = $item.find(this.options.slider);
                $item.addClass(this.options.activeClass);
                $slider.stop().hide().removeClass(accHiddenClass).slideDown({
                    duration: this.options.animSpeed, complete: function()
                        {
                            $slider.removeAttr('style');
                            if (this.options.scrollToActiveItem.enable && window.innerWidth <= this.options.scrollToActiveItem.breakpoint)
                            {
                                this.goToItem($item)
                            }
                            this.makeCallback('onShow', $item)
                        }.bind(this)
                });
                this.makeCallback('beforeShow', $item)
            }, hide: function($item)
            {
                var $slider = $item.find(this.options.slider);
                $item.removeClass(this.options.activeClass);
                $slider.stop().show().slideUp({
                    duration: this.options.animSpeed, complete: function()
                        {
                            $slider.addClass(accHiddenClass);
                            $slider.removeAttr('style');
                            this.makeCallback('onHide', $item)
                        }.bind(this)
                });
                this.makeCallback('beforeHide', $item)
            }, goToItem: function($item)
            {
                var itemOffset = $item.offset().top;
                if (itemOffset < $(window).scrollTop())
                {
                    if (typeof this.options.scrollToActiveItem.extraOffset === 'number')
                    {
                        itemOffset -= this.options.scrollToActiveItem.extraOffset
                    }
                    else if (typeof this.options.scrollToActiveItem.extraOffset === 'function')
                    {
                        itemOffset -= this.options.scrollToActiveItem.extraOffset()
                    }
                    $('body, html').animate({scrollTop: itemOffset}, this.options.scrollToActiveItem.animSpeed)
                }
            }, getActiveItem: function($item)
            {
                return $item.siblings().filter('.' + this.options.activeClass)
            }, makeCallback: function(name)
            {
                if (typeof this.options[name] === 'function')
                {
                    var args = Array.prototype.slice.call(arguments);
                    args.shift();
                    this.options[name].apply(this, args)
                }
            }, destroy: function()
            {
                this.$holder.removeData('SlideAccordion');
                this.$items.off(this.options.event, this.options.opener, this.accordionToggle);
                this.$items.removeClass(this.options.activeClass).each(function(i, item)
                {
                    $(item).find(this.options.slider).removeAttr('style').removeClass(accHiddenClass)
                }.bind(this));
                this.makeCallback('onDestroy')
            }
    };
    $.fn.slideAccordion = function(opt)
    {
        var args = Array.prototype.slice.call(arguments);
        var method = args[0];
        return this.each(function()
            {
                var $holder = jQuery(this);
                var instance = $holder.data('SlideAccordion');
                if (typeof opt === 'object' || typeof opt === 'undefined')
                {
                    new SlideAccordion($.extend(true, {holder: this}, opt))
                }
                else if (typeof method === 'string' && instance)
                {
                    if (typeof instance[method] === 'function')
                    {
                        args.shift();
                        instance[method].apply(instance, args)
                    }
                }
            })
    };
    (function()
    {
        var tabStyleSheet = $('<style type="text/css">')[0];
        var tabStyleRule = '.' + accHiddenClass;
        tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important; width: 100% !important;}';
        if (tabStyleSheet.styleSheet)
        {
            tabStyleSheet.styleSheet.cssText = tabStyleRule
        }
        else
        {
            tabStyleSheet.appendChild(document.createTextNode(tabStyleRule))
        }
        $('head').append(tabStyleSheet)
    }());
    return SlideAccordion
}));
function initDropDownClasses()
{
    jQuery(".nav-list li").each(function()
    {
        var n = jQuery(this),
            a = n.find(".dropmenu"),
            d = n.find("a").eq(0);
        a.length && (n.addClass("has-drop-down"), d.length && d.addClass("has-drop-down-a"))
    }),
    jQuery(".dropmenu ul > li").each(function()
    {
        var n = jQuery(this),
            a = n.find(".inner-dropmenu"),
            d = n.find("a").eq(0);
        a.length && (n.addClass("has-drop-down"), d.length && d.addClass("has-drop-down-a"))
    })
}
jQuery(function()
{
    initDropDownClasses()
});
jQuery(function()
{
    initCustomForms()
});
function initCustomForms()
{
    jcf.setOptions('Select', {
        wrapNative: false, wrapNativeOnMobile: false, fakeDropInBody: false
    });
    jcf.replaceAll()
}
if (!window.jcf)
{
    /*!
     * JavaScript Custom Forms
     *
     * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
     * Released under the MIT license (LICENSE.txt)
     *
     * Version: 1.1.3
     */
    ;
    (function(root, factory)
    {
        'use strict';
        if (typeof define === 'function' && define.amd)
        {
            define(['jquery'], factory)
        }
        else if (typeof exports === 'object')
        {
            module.exports = factory(require('jquery'))
        }
        else
        {
            root.jcf = factory(jQuery)
        }
    }(this, function($)
    {
        'use strict';
        var version = '1.1.3';
        var customInstances = [];
        var commonOptions = {
                optionsKey: 'jcf', dataKey: 'jcf-instance', rtlClass: 'jcf-rtl', focusClass: 'jcf-focus', pressedClass: 'jcf-pressed', disabledClass: 'jcf-disabled', hiddenClass: 'jcf-hidden', resetAppearanceClass: 'jcf-reset-appearance', unselectableClass: 'jcf-unselectable'
            };
        var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
            isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);
        commonOptions.isMobileDevice = !!(isTouchDevice || isWinPhoneDevice);
        var isIOS = /(iPad|iPhone).*OS ([0-9_]*) .*/.exec(navigator.userAgent);
        if (isIOS)
            isIOS = parseFloat(isIOS[2].replace(/_/g, '.'));
        commonOptions.ios = isIOS;
        var createStyleSheet = function()
            {
                var styleTag = $('<style>').appendTo('head'),
                    styleSheet = styleTag.prop('sheet') || styleTag.prop('styleSheet');
                var addCSSRule = function(selector, rules, index)
                    {
                        if (styleSheet.insertRule)
                        {
                            styleSheet.insertRule(selector + '{' + rules + '}', index)
                        }
                        else
                        {
                            styleSheet.addRule(selector, rules, index)
                        }
                    };
                addCSSRule('.' + commonOptions.hiddenClass, 'position:absolute !important;left:-9999px !important;height:1px !important;width:1px !important;margin:0 !important;border-width:0 !important;-webkit-appearance:none;-moz-appearance:none;appearance:none');
                addCSSRule('.' + commonOptions.rtlClass + ' .' + commonOptions.hiddenClass, 'right:-9999px !important; left: auto !important');
                addCSSRule('.' + commonOptions.unselectableClass, '-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-tap-highlight-color: rgba(0,0,0,0);');
                addCSSRule('.' + commonOptions.resetAppearanceClass, 'background: none; border: none; -webkit-appearance: none; appearance: none; opacity: 0; filter: alpha(opacity=0);');
                var html = $('html'),
                    body = $('body');
                if (html.css('direction') === 'rtl' || body.css('direction') === 'rtl')
                {
                    html.addClass(commonOptions.rtlClass)
                }
                html.on('reset', function()
                {
                    setTimeout(function()
                    {
                        api.refreshAll()
                    }, 0)
                });
                commonOptions.styleSheetCreated = true
            };
        (function()
        {
            var pointerEventsSupported = navigator.pointerEnabled || navigator.msPointerEnabled,
                touchEventsSupported = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
                eventList,
                eventMap = {},
                eventPrefix = 'jcf-';
            if (pointerEventsSupported)
            {
                eventList = {
                    pointerover: navigator.pointerEnabled ? 'pointerover' : 'MSPointerOver', pointerdown: navigator.pointerEnabled ? 'pointerdown' : 'MSPointerDown', pointermove: navigator.pointerEnabled ? 'pointermove' : 'MSPointerMove', pointerup: navigator.pointerEnabled ? 'pointerup' : 'MSPointerUp'
                }
            }
            else
            {
                eventList = {
                    pointerover: 'mouseover', pointerdown: 'mousedown' + (touchEventsSupported ? ' touchstart' : ''), pointermove: 'mousemove' + (touchEventsSupported ? ' touchmove' : ''), pointerup: 'mouseup' + (touchEventsSupported ? ' touchend' : '')
                }
            }
            $.each(eventList, function(targetEventName, fakeEventList)
            {
                $.each(fakeEventList.split(' '), function(index, fakeEventName)
                {
                    eventMap[fakeEventName] = targetEventName
                })
            });
            $.each(eventList, function(eventName, eventHandlers)
            {
                eventHandlers = eventHandlers.split(' ');
                $.event.special[eventPrefix + eventName] = {
                    setup: function()
                    {
                        var self = this;
                        $.each(eventHandlers, function(index, fallbackEvent)
                        {
                            if (self.addEventListener)
                                self.addEventListener(fallbackEvent, fixEvent, false);
                            else
                                self['on' + fallbackEvent] = fixEvent
                        })
                    }, teardown: function()
                        {
                            var self = this;
                            $.each(eventHandlers, function(index, fallbackEvent)
                            {
                                if (self.addEventListener)
                                    self.removeEventListener(fallbackEvent, fixEvent, false);
                                else
                                    self['on' + fallbackEvent] = null
                            })
                        }
                }
            });
            var lastTouch = null;
            var mouseEventSimulated = function(e)
                {
                    var dx = Math.abs(e.pageX - lastTouch.x),
                        dy = Math.abs(e.pageY - lastTouch.y),
                        rangeDistance = 25;
                    if (dx <= rangeDistance && dy <= rangeDistance)
                    {
                        return true
                    }
                };
            var fixEvent = function(e)
                {
                    var origEvent = e || window.event,
                        touchEventData = null,
                        targetEventName = eventMap[origEvent.type];
                    e = $.event.fix(origEvent);
                    e.type = eventPrefix + targetEventName;
                    if (origEvent.pointerType)
                    {
                        switch (origEvent.pointerType)
                        {
                            case 2:
                                e.pointerType = 'touch';
                                break;
                            case 3:
                                e.pointerType = 'pen';
                                break;
                            case 4:
                                e.pointerType = 'mouse';
                                break;
                            default:
                                e.pointerType = origEvent.pointerType
                        }
                    }
                    else
                    {
                        e.pointerType = origEvent.type.substr(0, 5)
                    }
                    if (!e.pageX && !e.pageY)
                    {
                        touchEventData = origEvent.changedTouches ? origEvent.changedTouches[0] : origEvent;
                        e.pageX = touchEventData.pageX;
                        e.pageY = touchEventData.pageY
                    }
                    if (origEvent.type === 'touchend')
                    {
                        lastTouch = {
                            x: e.pageX, y: e.pageY
                        }
                    }
                    if (e.pointerType === 'mouse' && lastTouch && mouseEventSimulated(e))
                    {
                        return
                    }
                    else
                    {
                        return ($.event.dispatch || $.event.handle).call(this, e)
                    }
                }
        }());
        (function()
        {
            var wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll').split(' '),
                shimEventName = 'jcf-mousewheel';
            $.event.special[shimEventName] = {
                setup: function()
                {
                    var self = this;
                    $.each(wheelEvents, function(index, fallbackEvent)
                    {
                        if (self.addEventListener)
                            self.addEventListener(fallbackEvent, fixEvent, false);
                        else
                            self['on' + fallbackEvent] = fixEvent
                    })
                }, teardown: function()
                    {
                        var self = this;
                        $.each(wheelEvents, function(index, fallbackEvent)
                        {
                            if (self.addEventListener)
                                self.removeEventListener(fallbackEvent, fixEvent, false);
                            else
                                self['on' + fallbackEvent] = null
                        })
                    }
            };
            var fixEvent = function(e)
                {
                    var origEvent = e || window.event;
                    e = $.event.fix(origEvent);
                    e.type = shimEventName;
                    if ('detail' in origEvent)
                    {
                        e.deltaY = -origEvent.detail
                    }
                    if ('wheelDelta' in origEvent)
                    {
                        e.deltaY = -origEvent.wheelDelta
                    }
                    if ('wheelDeltaY' in origEvent)
                    {
                        e.deltaY = -origEvent.wheelDeltaY
                    }
                    if ('wheelDeltaX' in origEvent)
                    {
                        e.deltaX = -origEvent.wheelDeltaX
                    }
                    if ('deltaY' in origEvent)
                    {
                        e.deltaY = origEvent.deltaY
                    }
                    if ('deltaX' in origEvent)
                    {
                        e.deltaX = origEvent.deltaX
                    }
                    e.delta = e.deltaY || e.deltaX;
                    if (origEvent.deltaMode === 1)
                    {
                        var lineHeight = 16;
                        e.delta *= lineHeight;
                        e.deltaY *= lineHeight;
                        e.deltaX *= lineHeight
                    }
                    return ($.event.dispatch || $.event.handle).call(this, e)
                }
        }());
        var moduleMixin = {
                fireNativeEvent: function(elements, eventName)
                {
                    $(elements).each(function()
                    {
                        var element = this,
                            eventObject;
                        if (element.dispatchEvent)
                        {
                            eventObject = document.createEvent('HTMLEvents');
                            eventObject.initEvent(eventName, true, true);
                            element.dispatchEvent(eventObject)
                        }
                        else if (document.createEventObject)
                        {
                            eventObject = document.createEventObject();
                            eventObject.target = element;
                            element.fireEvent('on' + eventName, eventObject)
                        }
                    })
                }, bindHandlers: function()
                    {
                        var self = this;
                        $.each(self, function(propName, propValue)
                        {
                            if (propName.indexOf('on') === 0 && $.isFunction(propValue))
                            {
                                self[propName] = function()
                                {
                                    return propValue.apply(self, arguments)
                                }
                            }
                        })
                    }
            };
        var api = {
                version: version, modules: {}, getOptions: function()
                    {
                        return $.extend({}, commonOptions)
                    }, setOptions: function(moduleName, moduleOptions)
                    {
                        if (arguments.length > 1)
                        {
                            if (this.modules[moduleName])
                            {
                                $.extend(this.modules[moduleName].prototype.options, moduleOptions)
                            }
                        }
                        else
                        {
                            $.extend(commonOptions, moduleName)
                        }
                    }, addModule: function(proto)
                    {
                        var Module = function(options)
                            {
                                if (!options.element.data(commonOptions.dataKey))
                                {
                                    options.element.data(commonOptions.dataKey, this)
                                }
                                customInstances.push(this);
                                this.options = $.extend({}, commonOptions, this.options, getInlineOptions(options.element), options);
                                this.bindHandlers();
                                this.init.apply(this, arguments)
                            };
                        var getInlineOptions = function(element)
                            {
                                var dataOptions = element.data(commonOptions.optionsKey),
                                    attrOptions = element.attr(commonOptions.optionsKey);
                                if (dataOptions)
                                {
                                    return dataOptions
                                }
                                else if (attrOptions)
                                {
                                    try
                                    {
                                        return $.parseJSON(attrOptions)
                                    }
                                    catch(e) {}
                                }
                            };
                        Module.prototype = proto;
                        $.extend(proto, moduleMixin);
                        if (proto.plugins)
                        {
                            $.each(proto.plugins, function(pluginName, plugin)
                            {
                                $.extend(plugin.prototype, moduleMixin)
                            })
                        }
                        var originalDestroy = Module.prototype.destroy;
                        Module.prototype.destroy = function()
                        {
                            this.options.element.removeData(this.options.dataKey);
                            for (var i = customInstances.length - 1; i >= 0; i--)
                            {
                                if (customInstances[i] === this)
                                {
                                    customInstances.splice(i, 1);
                                    break
                                }
                            }
                            if (originalDestroy)
                            {
                                originalDestroy.apply(this, arguments)
                            }
                        };
                        this.modules[proto.name] = Module
                    }, getInstance: function(element)
                    {
                        return $(element).data(commonOptions.dataKey)
                    }, replace: function(elements, moduleName, customOptions)
                    {
                        var self = this,
                            instance;
                        if (!commonOptions.styleSheetCreated)
                        {
                            createStyleSheet()
                        }
                        $(elements).each(function()
                        {
                            var moduleOptions,
                                element = $(this);
                            instance = element.data(commonOptions.dataKey);
                            if (instance)
                            {
                                instance.refresh()
                            }
                            else
                            {
                                if (!moduleName)
                                {
                                    $.each(self.modules, function(currentModuleName, module)
                                    {
                                        if (module.prototype.matchElement.call(module.prototype, element))
                                        {
                                            moduleName = currentModuleName;
                                            return false
                                        }
                                    })
                                }
                                if (moduleName)
                                {
                                    moduleOptions = $.extend({element: element}, customOptions);
                                    instance = new self.modules[moduleName](moduleOptions)
                                }
                            }
                        });
                        return instance
                    }, refresh: function(elements)
                    {
                        $(elements).each(function()
                        {
                            var instance = $(this).data(commonOptions.dataKey);
                            if (instance)
                            {
                                instance.refresh()
                            }
                        })
                    }, destroy: function(elements)
                    {
                        $(elements).each(function()
                        {
                            var instance = $(this).data(commonOptions.dataKey);
                            if (instance)
                            {
                                instance.destroy()
                            }
                        })
                    }, replaceAll: function(context)
                    {
                        var self = this;
                        $.each(this.modules, function(moduleName, module)
                        {
                            $(module.prototype.selector, context).each(function()
                            {
                                if (this.className.indexOf('jcf-ignore') < 0)
                                {
                                    self.replace(this, moduleName)
                                }
                            })
                        })
                    }, refreshAll: function(context)
                    {
                        if (context)
                        {
                            $.each(this.modules, function(moduleName, module)
                            {
                                $(module.prototype.selector, context).each(function()
                                {
                                    var instance = $(this).data(commonOptions.dataKey);
                                    if (instance)
                                    {
                                        instance.refresh()
                                    }
                                })
                            })
                        }
                        else
                        {
                            for (var i = customInstances.length - 1; i >= 0; i--)
                            {
                                customInstances[i].refresh()
                            }
                        }
                    }, destroyAll: function(context)
                    {
                        if (context)
                        {
                            $.each(this.modules, function(moduleName, module)
                            {
                                $(module.prototype.selector, context).each(function(index, element)
                                {
                                    var instance = $(element).data(commonOptions.dataKey);
                                    if (instance)
                                    {
                                        instance.destroy()
                                    }
                                })
                            })
                        }
                        else
                        {
                            while (customInstances.length)
                            {
                                customInstances[0].destroy()
                            }
                        }
                    }
            };
        window.jcf = api;
        return api
    }));
    /*!
     * JavaScript Custom Forms : Select Module
     *
     * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
     * Released under the MIT license (LICENSE.txt)
     *
     * Version: 1.1.3
     */
    ;
    (function($, window)
    {
        'use strict';
        jcf.addModule({
            name: 'Select', selector: 'select', options: {
                    element: null, multipleCompactStyle: false
                }, plugins: {
                    ListBox: ListBox, ComboBox: ComboBox, SelectList: SelectList
                }, matchElement: function(element)
                {
                    return element.is('select')
                }, init: function()
                {
                    this.element = $(this.options.element);
                    this.createInstance()
                }, isListBox: function()
                {
                    return this.element.is('[size]:not([jcf-size]), [multiple]')
                }, createInstance: function()
                {
                    if (this.instance)
                    {
                        this.instance.destroy()
                    }
                    if (this.isListBox() && !this.options.multipleCompactStyle)
                    {
                        this.instance = new ListBox(this.options)
                    }
                    else
                    {
                        this.instance = new ComboBox(this.options)
                    }
                }, refresh: function()
                {
                    var typeMismatch = (this.isListBox() && this.instance instanceof ComboBox) || (!this.isListBox() && this.instance instanceof ListBox);
                    if (typeMismatch)
                    {
                        this.createInstance()
                    }
                    else
                    {
                        this.instance.refresh()
                    }
                }, destroy: function()
                {
                    this.instance.destroy()
                }
        });
        function ComboBox(options)
        {
            this.options = $.extend({
                wrapNative: true, wrapNativeOnMobile: true, fakeDropInBody: true, useCustomScroll: true, flipDropToFit: true, maxVisibleItems: 10, fakeAreaStructure: '<span class="jcf-select"><span class="jcf-select-text"></span><span class="jcf-select-opener"></span></span>', fakeDropStructure: '<div class="jcf-select-drop"><div class="jcf-select-drop-content"></div></div>', optionClassPrefix: 'jcf-option-', selectClassPrefix: 'jcf-select-', dropContentSelector: '.jcf-select-drop-content', selectTextSelector: '.jcf-select-text', dropActiveClass: 'jcf-drop-active', flipDropClass: 'jcf-drop-flipped'
            }, options);
            this.init()
        }
        $.extend(ComboBox.prototype, {
            init: function()
            {
                this.initStructure();
                this.bindHandlers();
                this.attachEvents();
                this.refresh()
            }, initStructure: function()
                {
                    this.win = $(window);
                    this.doc = $(document);
                    this.realElement = $(this.options.element);
                    this.fakeElement = $(this.options.fakeAreaStructure).insertAfter(this.realElement);
                    this.selectTextContainer = this.fakeElement.find(this.options.selectTextSelector);
                    this.selectText = $('<span></span>').appendTo(this.selectTextContainer);
                    makeUnselectable(this.fakeElement);
                    this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
                    if (this.realElement.prop('multiple'))
                    {
                        this.fakeElement.addClass('jcf-compact-multiple')
                    }
                    if (this.options.isMobileDevice && this.options.wrapNativeOnMobile && !this.options.wrapNative)
                    {
                        this.options.wrapNative = true
                    }
                    if (this.options.wrapNative)
                    {
                        this.realElement.prependTo(this.fakeElement).css({
                            position: 'absolute', height: '100%', width: '100%'
                        }).addClass(this.options.resetAppearanceClass)
                    }
                    else
                    {
                        this.realElement.addClass(this.options.hiddenClass);
                        this.fakeElement.attr('title', this.realElement.attr('title'));
                        this.fakeDropTarget = this.options.fakeDropInBody ? $('body') : this.fakeElement
                    }
                }, attachEvents: function()
                {
                    var self = this;
                    this.delayedRefresh = function()
                    {
                        setTimeout(function()
                        {
                            self.refresh();
                            if (self.list)
                            {
                                self.list.refresh();
                                self.list.scrollToActiveOption()
                            }
                        }, 1)
                    };
                    if (this.options.wrapNative)
                    {
                        this.realElement.on({
                            focus: this.onFocus, change: this.onChange, click: this.onChange, keydown: this.onChange
                        })
                    }
                    else
                    {
                        this.realElement.on({
                            focus: this.onFocus, change: this.onChange, keydown: this.onKeyDown
                        });
                        this.fakeElement.on({'jcf-pointerdown': this.onSelectAreaPress})
                    }
                }, onKeyDown: function(e)
                {
                    if (e.which === 13)
                    {
                        this.toggleDropdown()
                    }
                    else if (this.dropActive)
                    {
                        this.delayedRefresh()
                    }
                }, onChange: function()
                {
                    this.refresh()
                }, onFocus: function()
                {
                    if (!this.pressedFlag || !this.focusedFlag)
                    {
                        this.fakeElement.addClass(this.options.focusClass);
                        this.realElement.on('blur', this.onBlur);
                        this.toggleListMode(true);
                        this.focusedFlag = true
                    }
                }, onBlur: function()
                {
                    if (!this.pressedFlag)
                    {
                        this.fakeElement.removeClass(this.options.focusClass);
                        this.realElement.off('blur', this.onBlur);
                        this.toggleListMode(false);
                        this.focusedFlag = false
                    }
                }, onResize: function()
                {
                    if (this.dropActive)
                    {
                        this.hideDropdown()
                    }
                }, onSelectDropPress: function()
                {
                    this.pressedFlag = true
                }, onSelectDropRelease: function(e, pointerEvent)
                {
                    this.pressedFlag = false;
                    if (pointerEvent.pointerType === 'mouse')
                    {
                        this.realElement.focus()
                    }
                }, onSelectAreaPress: function(e)
                {
                    var dropClickedInsideFakeElement = !this.options.fakeDropInBody && $(e.target).closest(this.dropdown).length;
                    if (dropClickedInsideFakeElement || e.button > 1 || this.realElement.is(':disabled'))
                    {
                        return
                    }
                    this.selectOpenedByEvent = e.pointerType;
                    this.toggleDropdown();
                    if (!this.focusedFlag)
                    {
                        if (e.pointerType === 'mouse')
                        {
                            this.realElement.focus()
                        }
                        else
                        {
                            this.onFocus(e)
                        }
                    }
                    this.pressedFlag = true;
                    this.fakeElement.addClass(this.options.pressedClass);
                    this.doc.on('jcf-pointerup', this.onSelectAreaRelease)
                }, onSelectAreaRelease: function(e)
                {
                    if (this.focusedFlag && e.pointerType === 'mouse')
                    {
                        this.realElement.focus()
                    }
                    this.pressedFlag = false;
                    this.fakeElement.removeClass(this.options.pressedClass);
                    this.doc.off('jcf-pointerup', this.onSelectAreaRelease)
                }, onOutsideClick: function(e)
                {
                    var target = $(e.target),
                        clickedInsideSelect = target.closest(this.fakeElement).length || target.closest(this.dropdown).length;
                    if (!clickedInsideSelect)
                    {
                        this.hideDropdown()
                    }
                }, onSelect: function()
                {
                    this.refresh();
                    if (this.realElement.prop('multiple'))
                    {
                        this.repositionDropdown()
                    }
                    else
                    {
                        this.hideDropdown()
                    }
                    this.fireNativeEvent(this.realElement, 'change')
                }, toggleListMode: function(state)
                {
                    if (!this.options.wrapNative)
                    {
                        if (state)
                        {
                            this.realElement.attr({
                                size: 4, 'jcf-size': ''
                            })
                        }
                        else
                        {
                            if (!this.options.wrapNative)
                            {
                                this.realElement.removeAttr('size jcf-size')
                            }
                        }
                    }
                }, createDropdown: function()
                {
                    if (this.dropdown)
                    {
                        this.list.destroy();
                        this.dropdown.remove()
                    }
                    this.dropdown = $(this.options.fakeDropStructure).appendTo(this.fakeDropTarget);
                    this.dropdown.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
                    makeUnselectable(this.dropdown);
                    if (this.realElement.prop('multiple'))
                    {
                        this.dropdown.addClass('jcf-compact-multiple')
                    }
                    if (this.options.fakeDropInBody)
                    {
                        this.dropdown.css({
                            position: 'absolute', top: -9999
                        })
                    }
                    this.list = new SelectList({
                        useHoverClass: true, handleResize: false, alwaysPreventMouseWheel: true, maxVisibleItems: this.options.maxVisibleItems, useCustomScroll: this.options.useCustomScroll, holder: this.dropdown.find(this.options.dropContentSelector), multipleSelectWithoutKey: this.realElement.prop('multiple'), element: this.realElement
                    });
                    $(this.list).on({
                        select: this.onSelect, press: this.onSelectDropPress, release: this.onSelectDropRelease
                    })
                }, repositionDropdown: function()
                {
                    var selectOffset = this.fakeElement.offset(),
                        selectWidth = this.fakeElement.outerWidth(),
                        selectHeight = this.fakeElement.outerHeight(),
                        dropHeight = this.dropdown.css('width', selectWidth).outerHeight(),
                        winScrollTop = this.win.scrollTop(),
                        winHeight = this.win.height(),
                        calcTop,
                        calcLeft,
                        bodyOffset,
                        needFlipDrop = false;
                    if (selectOffset.top + selectHeight + dropHeight > winScrollTop + winHeight && selectOffset.top - dropHeight > winScrollTop)
                    {
                        needFlipDrop = true
                    }
                    if (this.options.fakeDropInBody)
                    {
                        bodyOffset = this.fakeDropTarget.css('position') !== 'static' ? this.fakeDropTarget.offset().top : 0;
                        if (this.options.flipDropToFit && needFlipDrop)
                        {
                            calcLeft = selectOffset.left;
                            calcTop = selectOffset.top - dropHeight - bodyOffset
                        }
                        else
                        {
                            calcLeft = selectOffset.left;
                            calcTop = selectOffset.top + selectHeight - bodyOffset
                        }
                        this.dropdown.css({
                            width: selectWidth, left: calcLeft, top: calcTop
                        })
                    }
                    this.dropdown.add(this.fakeElement).toggleClass(this.options.flipDropClass, this.options.flipDropToFit && needFlipDrop)
                }, showDropdown: function()
                {
                    if (!this.realElement.prop('options').length)
                    {
                        return
                    }
                    if (!this.dropdown)
                    {
                        this.createDropdown()
                    }
                    this.dropActive = true;
                    this.dropdown.appendTo(this.fakeDropTarget);
                    this.fakeElement.addClass(this.options.dropActiveClass);
                    this.refreshSelectedText();
                    this.repositionDropdown();
                    this.list.setScrollTop(this.savedScrollTop);
                    this.list.refresh();
                    this.win.on('resize', this.onResize);
                    this.doc.on('jcf-pointerdown', this.onOutsideClick)
                }, hideDropdown: function()
                {
                    if (this.dropdown)
                    {
                        this.savedScrollTop = this.list.getScrollTop();
                        this.fakeElement.removeClass(this.options.dropActiveClass + ' ' + this.options.flipDropClass);
                        this.dropdown.removeClass(this.options.flipDropClass).detach();
                        this.doc.off('jcf-pointerdown', this.onOutsideClick);
                        this.win.off('resize', this.onResize);
                        this.dropActive = false;
                        if (this.selectOpenedByEvent === 'touch')
                        {
                            this.onBlur()
                        }
                    }
                }, toggleDropdown: function()
                {
                    if (this.dropActive)
                    {
                        this.hideDropdown()
                    }
                    else
                    {
                        this.showDropdown()
                    }
                }, refreshSelectedText: function()
                {
                    var selectedIndex = this.realElement.prop('selectedIndex'),
                        selectedOption = this.realElement.prop('options')[selectedIndex],
                        selectedOptionImage = selectedOption ? selectedOption.getAttribute('data-image') : null,
                        selectedOptionText = '',
                        selectedOptionClasses,
                        self = this;
                    if (this.realElement.prop('multiple'))
                    {
                        $.each(this.realElement.prop('options'), function(index, option)
                        {
                            if (option.selected)
                            {
                                selectedOptionText += (selectedOptionText ? ', ' : '') + option.innerHTML
                            }
                        });
                        if (!selectedOptionText)
                        {
                            selectedOptionText = self.realElement.attr('placeholder') || ''
                        }
                        this.selectText.removeAttr('class').html(selectedOptionText)
                    }
                    else if (!selectedOption)
                    {
                        if (this.selectImage)
                        {
                            this.selectImage.hide()
                        }
                        this.selectText.removeAttr('class').empty()
                    }
                    else if (this.currentSelectedText !== selectedOption.innerHTML || this.currentSelectedImage !== selectedOptionImage)
                    {
                        selectedOptionClasses = getPrefixedClasses(selectedOption.className, this.options.optionClassPrefix);
                        this.selectText.attr('class', selectedOptionClasses).html(selectedOption.innerHTML);
                        if (selectedOptionImage)
                        {
                            if (!this.selectImage)
                            {
                                this.selectImage = $('<img>').prependTo(this.selectTextContainer).hide()
                            }
                            this.selectImage.attr('src', selectedOptionImage).show()
                        }
                        else if (this.selectImage)
                        {
                            this.selectImage.hide()
                        }
                        this.currentSelectedText = selectedOption.innerHTML;
                        this.currentSelectedImage = selectedOptionImage
                    }
                }, refresh: function()
                {
                    if (this.realElement.prop('style').display === 'none')
                    {
                        this.fakeElement.hide()
                    }
                    else
                    {
                        this.fakeElement.show()
                    }
                    this.refreshSelectedText();
                    this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'))
                }, destroy: function()
                {
                    if (this.options.wrapNative)
                    {
                        this.realElement.insertBefore(this.fakeElement).css({
                            position: '', height: '', width: ''
                        }).removeClass(this.options.resetAppearanceClass)
                    }
                    else
                    {
                        this.realElement.removeClass(this.options.hiddenClass);
                        if (this.realElement.is('[jcf-size]'))
                        {
                            this.realElement.removeAttr('size jcf-size')
                        }
                    }
                    this.fakeElement.remove();
                    this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
                    this.realElement.off({focus: this.onFocus})
                }
        });
        function ListBox(options)
        {
            this.options = $.extend({
                wrapNative: true, useCustomScroll: true, fakeStructure: '<span class="jcf-list-box"><span class="jcf-list-wrapper"></span></span>', selectClassPrefix: 'jcf-select-', listHolder: '.jcf-list-wrapper'
            }, options);
            this.init()
        }
        $.extend(ListBox.prototype, {
            init: function()
            {
                this.bindHandlers();
                this.initStructure();
                this.attachEvents()
            }, initStructure: function()
                {
                    this.realElement = $(this.options.element);
                    this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
                    this.listHolder = this.fakeElement.find(this.options.listHolder);
                    makeUnselectable(this.fakeElement);
                    this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
                    this.realElement.addClass(this.options.hiddenClass);
                    this.list = new SelectList({
                        useCustomScroll: this.options.useCustomScroll, holder: this.listHolder, selectOnClick: false, element: this.realElement
                    })
                }, attachEvents: function()
                {
                    var self = this;
                    this.delayedRefresh = function(e)
                    {
                        if (e && e.which === 16)
                        {
                            return
                        }
                        else
                        {
                            clearTimeout(self.refreshTimer);
                            self.refreshTimer = setTimeout(function()
                            {
                                self.refresh();
                                self.list.scrollToActiveOption()
                            }, 1)
                        }
                    };
                    this.realElement.on({
                        focus: this.onFocus, click: this.delayedRefresh, keydown: this.delayedRefresh
                    });
                    $(this.list).on({
                        select: this.onSelect, press: this.onFakeOptionsPress, release: this.onFakeOptionsRelease
                    })
                }, onFakeOptionsPress: function(e, pointerEvent)
                {
                    this.pressedFlag = true;
                    if (pointerEvent.pointerType === 'mouse')
                    {
                        this.realElement.focus()
                    }
                }, onFakeOptionsRelease: function(e, pointerEvent)
                {
                    this.pressedFlag = false;
                    if (pointerEvent.pointerType === 'mouse')
                    {
                        this.realElement.focus()
                    }
                }, onSelect: function()
                {
                    this.fireNativeEvent(this.realElement, 'change');
                    this.fireNativeEvent(this.realElement, 'click')
                }, onFocus: function()
                {
                    if (!this.pressedFlag || !this.focusedFlag)
                    {
                        this.fakeElement.addClass(this.options.focusClass);
                        this.realElement.on('blur', this.onBlur);
                        this.focusedFlag = true
                    }
                }, onBlur: function()
                {
                    if (!this.pressedFlag)
                    {
                        this.fakeElement.removeClass(this.options.focusClass);
                        this.realElement.off('blur', this.onBlur);
                        this.focusedFlag = false
                    }
                }, refresh: function()
                {
                    this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
                    this.list.refresh()
                }, destroy: function()
                {
                    this.list.destroy();
                    this.realElement.insertBefore(this.fakeElement).removeClass(this.options.hiddenClass);
                    this.fakeElement.remove()
                }
        });
        function SelectList(options)
        {
            this.options = $.extend({
                holder: null, maxVisibleItems: 10, selectOnClick: true, useHoverClass: false, useCustomScroll: false, handleResize: true, multipleSelectWithoutKey: false, alwaysPreventMouseWheel: false, indexAttribute: 'data-index', cloneClassPrefix: 'jcf-option-', containerStructure: '<span class="jcf-list"><span class="jcf-list-content"></span></span>', containerSelector: '.jcf-list-content', captionClass: 'jcf-optgroup-caption', disabledClass: 'jcf-disabled', optionClass: 'jcf-option', groupClass: 'jcf-optgroup', hoverClass: 'jcf-hover', selectedClass: 'jcf-selected', scrollClass: 'jcf-scroll-active'
            }, options);
            this.init()
        }
        $.extend(SelectList.prototype, {
            init: function()
            {
                this.initStructure();
                this.refreshSelectedClass();
                this.attachEvents()
            }, initStructure: function()
                {
                    this.element = $(this.options.element);
                    this.indexSelector = '[' + this.options.indexAttribute + ']';
                    this.container = $(this.options.containerStructure).appendTo(this.options.holder);
                    this.listHolder = this.container.find(this.options.containerSelector);
                    this.lastClickedIndex = this.element.prop('selectedIndex');
                    this.rebuildList()
                }, attachEvents: function()
                {
                    this.bindHandlers();
                    this.listHolder.on('jcf-pointerdown', this.indexSelector, this.onItemPress);
                    this.listHolder.on('jcf-pointerdown', this.onPress);
                    if (this.options.useHoverClass)
                    {
                        this.listHolder.on('jcf-pointerover', this.indexSelector, this.onHoverItem)
                    }
                }, onPress: function(e)
                {
                    $(this).trigger('press', e);
                    this.listHolder.on('jcf-pointerup', this.onRelease)
                }, onRelease: function(e)
                {
                    $(this).trigger('release', e);
                    this.listHolder.off('jcf-pointerup', this.onRelease)
                }, onHoverItem: function(e)
                {
                    var hoverIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute));
                    this.fakeOptions.removeClass(this.options.hoverClass).eq(hoverIndex).addClass(this.options.hoverClass)
                }, onItemPress: function(e)
                {
                    if (e.pointerType === 'touch' || this.options.selectOnClick)
                    {
                        this.tmpListOffsetTop = this.list.offset().top;
                        this.listHolder.on('jcf-pointerup', this.indexSelector, this.onItemRelease)
                    }
                    else
                    {
                        this.onSelectItem(e)
                    }
                }, onItemRelease: function(e)
                {
                    this.listHolder.off('jcf-pointerup', this.indexSelector, this.onItemRelease);
                    if (this.tmpListOffsetTop === this.list.offset().top)
                    {
                        this.listHolder.on('click', this.indexSelector, {savedPointerType: e.pointerType}, this.onSelectItem)
                    }
                    delete this.tmpListOffsetTop
                }, onSelectItem: function(e)
                {
                    var clickedIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute)),
                        pointerType = e.data && e.data.savedPointerType || e.pointerType || 'mouse',
                        range;
                    this.listHolder.off('click', this.indexSelector, this.onSelectItem);
                    if (e.button > 1 || this.realOptions[clickedIndex].disabled)
                    {
                        return
                    }
                    if (this.element.prop('multiple'))
                    {
                        if (e.metaKey || e.ctrlKey || pointerType === 'touch' || this.options.multipleSelectWithoutKey)
                        {
                            this.realOptions[clickedIndex].selected = !this.realOptions[clickedIndex].selected
                        }
                        else if (e.shiftKey)
                        {
                            range = [this.lastClickedIndex, clickedIndex].sort(function(a, b)
                            {
                                return a - b
                            });
                            this.realOptions.each(function(index, option)
                            {
                                option.selected = (index >= range[0] && index <= range[1])
                            })
                        }
                        else
                        {
                            this.element.prop('selectedIndex', clickedIndex)
                        }
                    }
                    else
                    {
                        this.element.prop('selectedIndex', clickedIndex)
                    }
                    if (!e.shiftKey)
                    {
                        this.lastClickedIndex = clickedIndex
                    }
                    this.refreshSelectedClass();
                    if (pointerType === 'mouse')
                    {
                        this.scrollToActiveOption()
                    }
                    $(this).trigger('select')
                }, rebuildList: function()
                {
                    var self = this,
                        rootElement = this.element[0];
                    this.storedSelectHTML = rootElement.innerHTML;
                    this.optionIndex = 0;
                    this.list = $(this.createOptionsList(rootElement));
                    this.listHolder.empty().append(this.list);
                    this.realOptions = this.element.find('option');
                    this.fakeOptions = this.list.find(this.indexSelector);
                    this.fakeListItems = this.list.find('.' + this.options.captionClass + ',' + this.indexSelector);
                    delete this.optionIndex;
                    var maxCount = this.options.maxVisibleItems,
                        sizeValue = this.element.prop('size');
                    if (sizeValue > 1 && !this.element.is('[jcf-size]'))
                    {
                        maxCount = sizeValue
                    }
                    var needScrollBar = this.fakeOptions.length > maxCount;
                    this.container.toggleClass(this.options.scrollClass, needScrollBar);
                    if (needScrollBar)
                    {
                        this.listHolder.css({
                            maxHeight: this.getOverflowHeight(maxCount), overflow: 'auto'
                        });
                        if (this.options.useCustomScroll && jcf.modules.Scrollable)
                        {
                            jcf.replace(this.listHolder, 'Scrollable', {
                                handleResize: this.options.handleResize, alwaysPreventMouseWheel: this.options.alwaysPreventMouseWheel
                            });
                            return
                        }
                    }
                    if (this.options.alwaysPreventMouseWheel)
                    {
                        this.preventWheelHandler = function(e)
                        {
                            var currentScrollTop = self.listHolder.scrollTop(),
                                maxScrollTop = self.listHolder.prop('scrollHeight') - self.listHolder.innerHeight();
                            if ((currentScrollTop <= 0 && e.deltaY < 0) || (currentScrollTop >= maxScrollTop && e.deltaY > 0))
                            {
                                e.preventDefault()
                            }
                        };
                        this.listHolder.on('jcf-mousewheel', this.preventWheelHandler)
                    }
                }, refreshSelectedClass: function()
                {
                    var self = this,
                        selectedItem,
                        isMultiple = this.element.prop('multiple'),
                        selectedIndex = this.element.prop('selectedIndex');
                    if (isMultiple)
                    {
                        this.realOptions.each(function(index, option)
                        {
                            self.fakeOptions.eq(index).toggleClass(self.options.selectedClass, !!option.selected)
                        })
                    }
                    else
                    {
                        this.fakeOptions.removeClass(this.options.selectedClass + ' ' + this.options.hoverClass);
                        selectedItem = this.fakeOptions.eq(selectedIndex).addClass(this.options.selectedClass);
                        if (this.options.useHoverClass)
                        {
                            selectedItem.addClass(this.options.hoverClass)
                        }
                    }
                }, scrollToActiveOption: function()
                {
                    var targetOffset = this.getActiveOptionOffset();
                    if (typeof targetOffset === 'number')
                    {
                        this.listHolder.prop('scrollTop', targetOffset)
                    }
                }, getSelectedIndexRange: function()
                {
                    var firstSelected = -1,
                        lastSelected = -1;
                    this.realOptions.each(function(index, option)
                    {
                        if (option.selected)
                        {
                            if (firstSelected < 0)
                            {
                                firstSelected = index
                            }
                            lastSelected = index
                        }
                    });
                    return [firstSelected, lastSelected]
                }, getChangedSelectedIndex: function()
                {
                    var selectedIndex = this.element.prop('selectedIndex'),
                        targetIndex;
                    if (this.element.prop('multiple'))
                    {
                        if (!this.previousRange)
                        {
                            this.previousRange = [selectedIndex, selectedIndex]
                        }
                        this.currentRange = this.getSelectedIndexRange();
                        targetIndex = this.currentRange[this.currentRange[0] !== this.previousRange[0] ? 0 : 1];
                        this.previousRange = this.currentRange;
                        return targetIndex
                    }
                    else
                    {
                        return selectedIndex
                    }
                }, getActiveOptionOffset: function()
                {
                    var dropHeight = this.listHolder.height(),
                        dropScrollTop = this.listHolder.prop('scrollTop'),
                        currentIndex = this.getChangedSelectedIndex(),
                        fakeOption = this.fakeOptions.eq(currentIndex),
                        fakeOptionOffset = fakeOption.offset().top - this.list.offset().top,
                        fakeOptionHeight = fakeOption.innerHeight();
                    if (fakeOptionOffset + fakeOptionHeight >= dropScrollTop + dropHeight)
                    {
                        return fakeOptionOffset - dropHeight + fakeOptionHeight
                    }
                    else if (fakeOptionOffset < dropScrollTop)
                    {
                        return fakeOptionOffset
                    }
                }, getOverflowHeight: function(sizeValue)
                {
                    var item = this.fakeListItems.eq(sizeValue - 1),
                        listOffset = this.list.offset().top,
                        itemOffset = item.offset().top,
                        itemHeight = item.innerHeight();
                    return itemOffset + itemHeight - listOffset
                }, getScrollTop: function()
                {
                    return this.listHolder.scrollTop()
                }, setScrollTop: function(value)
                {
                    this.listHolder.scrollTop(value)
                }, createOption: function(option)
                {
                    var newOption = document.createElement('span');
                    newOption.className = this.options.optionClass;
                    newOption.innerHTML = option.innerHTML;
                    newOption.setAttribute(this.options.indexAttribute, this.optionIndex++);
                    var optionImage,
                        optionImageSrc = option.getAttribute('data-image');
                    if (optionImageSrc)
                    {
                        optionImage = document.createElement('img');
                        optionImage.src = optionImageSrc;
                        newOption.insertBefore(optionImage, newOption.childNodes[0])
                    }
                    if (option.disabled)
                    {
                        newOption.className += ' ' + this.options.disabledClass
                    }
                    if (option.className)
                    {
                        newOption.className += ' ' + getPrefixedClasses(option.className, this.options.cloneClassPrefix)
                    }
                    return newOption
                }, createOptGroup: function(optgroup)
                {
                    var optGroupContainer = document.createElement('span'),
                        optGroupName = optgroup.getAttribute('label'),
                        optGroupCaption,
                        optGroupList;
                    optGroupCaption = document.createElement('span');
                    optGroupCaption.className = this.options.captionClass;
                    optGroupCaption.innerHTML = optGroupName;
                    optGroupContainer.appendChild(optGroupCaption);
                    if (optgroup.children.length)
                    {
                        optGroupList = this.createOptionsList(optgroup);
                        optGroupContainer.appendChild(optGroupList)
                    }
                    optGroupContainer.className = this.options.groupClass;
                    return optGroupContainer
                }, createOptionContainer: function()
                {
                    var optionContainer = document.createElement('li');
                    return optionContainer
                }, createOptionsList: function(container)
                {
                    var self = this,
                        list = document.createElement('ul');
                    $.each(container.children, function(index, currentNode)
                    {
                        var item = self.createOptionContainer(currentNode),
                            newNode;
                        switch (currentNode.tagName.toLowerCase())
                        {
                            case'option':
                                newNode = self.createOption(currentNode);
                                break;
                            case'optgroup':
                                newNode = self.createOptGroup(currentNode);
                                break
                        }
                        list.appendChild(item).appendChild(newNode)
                    });
                    return list
                }, refresh: function()
                {
                    if (this.storedSelectHTML !== this.element.prop('innerHTML'))
                    {
                        this.rebuildList()
                    }
                    var scrollInstance = jcf.getInstance(this.listHolder);
                    if (scrollInstance)
                    {
                        scrollInstance.refresh()
                    }
                    this.refreshSelectedClass()
                }, destroy: function()
                {
                    this.listHolder.off('jcf-mousewheel', this.preventWheelHandler);
                    this.listHolder.off('jcf-pointerdown', this.indexSelector, this.onSelectItem);
                    this.listHolder.off('jcf-pointerover', this.indexSelector, this.onHoverItem);
                    this.listHolder.off('jcf-pointerdown', this.onPress)
                }
        });
        var getPrefixedClasses = function(className, prefixToAdd)
            {
                return className ? className.replace(/[\s]*([\S]+)+[\s]*/gi, prefixToAdd + '$1 ') : ''
            };
        var makeUnselectable = (function()
            {
                var unselectableClass = jcf.getOptions().unselectableClass;
                function preventHandler(e)
                {
                    e.preventDefault()
                }
                return function(node)
                    {
                        node.addClass(unselectableClass).on('selectstart', preventHandler)
                    }
            }())
    }(jQuery, this))
}
;
document.addEventListener("lazyloaded", function(t)
{
    var e = jQuery(t.target),
        n = e.closest(".js-bg-image"),
        i = e.closest(".js-zoom-image");
    n.length && initBgImage(e, n),
    i.length && initModalZoom(i, t.target)
}),
function(t, e)
{
    var n = function(t, e)
        {
            "use strict";
            if (e.getElementsByClassName)
            {
                var n,
                    i,
                    a = e.documentElement,
                    r = t.Date,
                    s = t.HTMLPictureElement,
                    o = "addEventListener",
                    l = "getAttribute",
                    c = t[o],
                    d = t.setTimeout,
                    u = t.requestAnimationFrame || d,
                    f = t.requestIdleCallback,
                    m = /^picture$/i,
                    g = ["load", "error", "lazyincluded", "_lazyloaded"],
                    z = {},
                    v = Array.prototype.forEach,
                    y = function(t, e)
                    {
                        return z[e] || (z[e] = new RegExp("(\\s|^)" + e + "(\\s|$)")), z[e].test(t[l]("class") || "") && z[e]
                    },
                    h = function(t, e)
                    {
                        y(t, e) || t.setAttribute("class", (t[l]("class") || "").trim() + " " + e)
                    },
                    p = function(t, e)
                    {
                        var n;
                        (n = y(t, e)) && t.setAttribute("class", (t[l]("class") || "").replace(n, " "))
                    },
                    b = function(t, e, n)
                    {
                        var i = n ? o : "removeEventListener";
                        n && b(t, e),
                        g.forEach(function(n)
                        {
                            t[i](n, e)
                        })
                    },
                    C = function(t, i, a, r, s)
                    {
                        var o = e.createEvent("Event");
                        return a || (a = {}), a.instance = n, o.initEvent(i, !r, !s), o.detail = a, t.dispatchEvent(o), o
                    },
                    A = function(e, n)
                    {
                        var a;
                        !s && (a = t.picturefill || i.pf) ? (n && n.src && !e[l]("srcset") && e.setAttribute("srcset", n.src), a({
                            reevaluate: !0, elements: [e]
                        })) : n && n.src && (e.src = n.src)
                    },
                    E = function(t, e)
                    {
                        return (getComputedStyle(t, null) || {})[e]
                    },
                    M = function(t, e, n)
                    {
                        for (n = n || t.offsetWidth; n < i.minSize && e && !t._lazysizesWidth; )
                            n = e.offsetWidth,
                            e = e.parentNode;
                        return n
                    },
                    w = function()
                    {
                        var t,
                            n,
                            i = [],
                            a = [],
                            r = i,
                            s = function()
                            {
                                var e = r;
                                for (r = i.length ? a : i, t = !0, n = !1; e.length; )
                                    e.shift()();
                                t = !1
                            },
                            o = function(i, a)
                            {
                                t && !a ? i.apply(this, arguments) : (r.push(i), n || (n = !0, (e.hidden ? d : u)(s)))
                            };
                        return o._lsFlush = s, o
                    }(),
                    N = function(t, e)
                    {
                        return e ? function()
                            {
                                w(t)
                            } : function()
                            {
                                var e = this,
                                    n = arguments;
                                w(function()
                                {
                                    t.apply(e, n)
                                })
                            }
                    },
                    _ = function(t)
                    {
                        var e,
                            n = 0,
                            a = i.throttleDelay,
                            s = i.ricTimeout,
                            o = function()
                            {
                                e = !1,
                                n = r.now(),
                                t()
                            },
                            l = f && s > 49 ? function()
                            {
                                f(o, {timeout: s}),
                                s !== i.ricTimeout && (s = i.ricTimeout)
                            } : N(function()
                            {
                                d(o)
                            }, !0);
                        return function(t)
                            {
                                var i;
                                (t = !0 === t) && (s = 33),
                                e || (e = !0, (i = a - (r.now() - n)) < 0 && (i = 0), t || i < 9 ? l() : d(l, i))
                            }
                    },
                    W = function(t)
                    {
                        var e,
                            n,
                            i = function()
                            {
                                e = null,
                                t()
                            },
                            a = function()
                            {
                                var t = r.now() - n;
                                t < 99 ? d(a, 99 - t) : (f || i)(i)
                            };
                        return function()
                            {
                                n = r.now(),
                                e || (e = d(a, 99))
                            }
                    };
                !function()
                {
                    var e,
                        n = {
                            lazyClass: "lazyload", loadedClass: "lazyloaded", loadingClass: "lazyloading", preloadClass: "lazypreload", errorClass: "lazyerror", autosizesClass: "lazyautosizes", srcAttr: "data-src", srcsetAttr: "data-srcset", sizesAttr: "data-sizes", minSize: 40, customMedia: {}, init: !0, expFactor: 1.5, hFac: .8, loadMode: 2, loadHidden: !0, ricTimeout: 0, throttleDelay: 125
                        };
                    for (e in i = t.lazySizesConfig || t.lazysizesConfig || {}, n)
                        e in i || (i[e] = n[e]);
                    t.lazySizesConfig = i,
                    d(function()
                    {
                        i.init && T()
                    })
                }();
                var x = function()
                    {
                        var s,
                            u,
                            f,
                            g,
                            z,
                            M,
                            x,
                            T,
                            F,
                            L,
                            S,
                            R,
                            k,
                            D,
                            H = /^img$/i,
                            O = /^iframe$/i,
                            P = "onscroll" in t && !/(gle|ing)bot/.test(navigator.userAgent),
                            $ = 0,
                            j = 0,
                            I = -1,
                            q = function(t)
                            {
                                j--,
                                t && t.target && b(t.target, q),
                                (!t || j < 0 || !t.target) && (j = 0)
                            },
                            Q = function(t, n)
                            {
                                var i,
                                    r = t,
                                    s = "hidden" == E(e.body, "visibility") || "hidden" != E(t.parentNode, "visibility") && "hidden" != E(t, "visibility");
                                for (T -= n, S += n, F -= n, L += n; s && (r = r.offsetParent) && r != e.body && r != a; )
                                    (s = (E(r, "opacity") || 1) > 0) && "visible" != E(r, "overflow") && (i = r.getBoundingClientRect(), s = L > i.left && F < i.right && S > i.top - 1 && T < i.bottom + 1);
                                return s
                            },
                            Z = function()
                            {
                                var t,
                                    r,
                                    o,
                                    c,
                                    d,
                                    f,
                                    m,
                                    z,
                                    v,
                                    y = n.elements;
                                if ((g = i.loadMode) && j < 8 && (t = y.length))
                                {
                                    r = 0,
                                    I++,
                                    null == k && ("expand" in i || (i.expand = a.clientHeight > 500 && a.clientWidth > 500 ? 500 : 370), R = i.expand, k = R * i.expFactor),
                                    $ < k && j < 1 && I > 2 && g > 2 && !e.hidden ? ($ = k, I = 0) : $ = g > 1 && I > 1 && j < 6 ? R : 0;
                                    for (; r < t; r++)
                                        if (y[r] && !y[r]._lazyRace)
                                            if (P)
                                                if ((z = y[r][l]("data-expand")) && (f = 1 * z) || (f = $), v !== f && (M = innerWidth + f * D, x = innerHeight + f, m = -1 * f, v = f), o = y[r].getBoundingClientRect(), (S = o.bottom) >= m && (T = o.top) <= x && (L = o.right) >= m * D && (F = o.left) <= M && (S || L || F || T) && (i.loadHidden || "hidden" != E(y[r], "visibility")) && (u && j < 3 && !z && (g < 3 || I < 4) || Q(y[r], f)))
                                                {
                                                    if (Y(y[r]), d = !0, j > 9)
                                                        break
                                                }
                                                else
                                                    !d && u && !c && j < 4 && I < 4 && g > 2 && (s[0] || i.preloadAfterLoad) && (s[0] || !z && (S || L || F || T || "auto" != y[r][l](i.sizesAttr))) && (c = s[0] || y[r]);
                                            else
                                                Y(y[r]);
                                    c && !d && Y(c)
                                }
                            },
                            G = _(Z),
                            J = function(t)
                            {
                                h(t.target, i.loadedClass),
                                p(t.target, i.loadingClass),
                                b(t.target, U),
                                C(t.target, "lazyloaded")
                            },
                            K = N(J),
                            U = function(t)
                            {
                                K({target: t.target})
                            },
                            V = function(t)
                            {
                                var e,
                                    n = t[l](i.srcsetAttr);
                                (e = i.customMedia[t[l]("data-media") || t[l]("media")]) && t.setAttribute("media", e),
                                n && t.setAttribute("srcset", n)
                            },
                            X = N(function(t, e, n, a, r)
                            {
                                var s,
                                    o,
                                    c,
                                    u,
                                    g,
                                    z;
                                (g = C(t, "lazybeforeunveil", e)).defaultPrevented || (a && (n ? h(t, i.autosizesClass) : t.setAttribute("sizes", a)), o = t[l](i.srcsetAttr), s = t[l](i.srcAttr), r && (c = t.parentNode, u = c && m.test(c.nodeName || "")), z = e.firesLoad || "src" in t && (o || s || u), g = {target: t}, z && (b(t, q, !0), clearTimeout(f), f = d(q, 2500), h(t, i.loadingClass), b(t, U, !0)), u && v.call(c.getElementsByTagName("source"), V), o ? t.setAttribute("srcset", o) : s && !u && (O.test(t.nodeName) ? function(t, e)
                                    {
                                        try
                                        {
                                            t.contentWindow.location.replace(e)
                                        }
                                        catch(n)
                                        {
                                            t.src = e
                                        }
                                    }(t, s) : t.src = s), r && (o || u) && A(t, {src: s})),
                                t._lazyRace && delete t._lazyRace,
                                p(t, i.lazyClass),
                                w(function()
                                {
                                    (!z || t.complete && t.naturalWidth > 1) && (z ? q(g) : j--, J(g))
                                }, !0)
                            }),
                            Y = function(t)
                            {
                                var e,
                                    n = H.test(t.nodeName),
                                    a = n && (t[l](i.sizesAttr) || t[l]("sizes")),
                                    r = "auto" == a;
                                (!r && u || !n || !t[l]("src") && !t.srcset || t.complete || y(t, i.errorClass) || !y(t, i.lazyClass)) && (e = C(t, "lazyunveilread").detail, r && B.updateElem(t, !0, t.offsetWidth), t._lazyRace = !0, j++, X(t, e, r, a, n))
                            },
                            tt = function()
                            {
                                if (!u)
                                {
                                    if (r.now() - z < 999)
                                        return void d(tt, 999);
                                    var t = W(function()
                                        {
                                            i.loadMode = 3,
                                            G()
                                        });
                                    u = !0,
                                    i.loadMode = 3,
                                    G(),
                                    c("scroll", function()
                                    {
                                        3 == i.loadMode && (i.loadMode = 2),
                                        t()
                                    }, !0)
                                }
                            };
                        return {
                                _: function()
                                {
                                    z = r.now(),
                                    n.elements = e.getElementsByClassName(i.lazyClass),
                                    s = e.getElementsByClassName(i.lazyClass + " " + i.preloadClass),
                                    D = i.hFac,
                                    c("scroll", G, !0),
                                    c("resize", G, !0),
                                    t.MutationObserver ? new MutationObserver(G).observe(a, {
                                        childList: !0, subtree: !0, attributes: !0
                                    }) : (a[o]("DOMNodeInserted", G, !0), a[o]("DOMAttrModified", G, !0), setInterval(G, 999)),
                                    c("hashchange", G, !0),
                                    ["focus", "mouseover", "click", "load", "transitionend", "animationend", "webkitAnimationEnd"].forEach(function(t)
                                    {
                                        e[o](t, G, !0)
                                    }),
                                    /d$|^c/.test(e.readyState) ? tt() : (c("load", tt), e[o]("DOMContentLoaded", G), d(tt, 2e4)),
                                    n.elements.length ? (Z(), w._lsFlush()) : G()
                                }, checkElems: G, unveil: Y
                            }
                    }(),
                    B = function()
                    {
                        var t,
                            n = N(function(t, e, n, i)
                            {
                                var a,
                                    r,
                                    s;
                                if (t._lazysizesWidth = i, i += "px", t.setAttribute("sizes", i), m.test(e.nodeName || ""))
                                    for (a = e.getElementsByTagName("source"), r = 0, s = a.length; r < s; r++)
                                        a[r].setAttribute("sizes", i);
                                n.detail.dataAttr || A(t, n.detail)
                            }),
                            a = function(t, e, i)
                            {
                                var a,
                                    r = t.parentNode;
                                r && (i = M(t, r, i), (a = C(t, "lazybeforesizes", {
                                    width: i, dataAttr: !!e
                                })).defaultPrevented || (i = a.detail.width) && i !== t._lazysizesWidth && n(t, r, a, i))
                            },
                            r = W(function()
                            {
                                var e,
                                    n = t.length;
                                if (n)
                                    for (e = 0; e < n; e++)
                                        a(t[e])
                            });
                        return {
                                _: function()
                                {
                                    t = e.getElementsByClassName(i.autosizesClass),
                                    c("resize", r)
                                }, checkElems: r, updateElem: a
                            }
                    }(),
                    T = function()
                    {
                        T.i || (T.i = !0, B._(), x._())
                    };
                return n = {
                        cfg: i, autoSizer: B, loader: x, init: T, uP: A, aC: h, rC: p, hC: y, fire: C, gW: M, rAF: w
                    }
            }
        }(t, t.document);
    t.lazySizes = n,
    "object" == typeof module && module.exports && (module.exports = n)
}(window);
jQuery(function()
{
    initMobileNav()
});
function initMobileNav()
{
    var $body = $('body');
    jQuery('body').mobileNav({
        menuActiveClass: 'nav-active', menuOpener: '.nav-opener', hideOnClickOutside: true, menuDrop: '.nav-drop', onBeforeShow: function(self)
            {
                $body.removeClass('ci_nav-off');
                try
                {
                    console.log(self.drop.disablePageScroll('attachEvents'));
                    self.drop.disablePageScroll('attachEvents')
                }
                catch(ex) {}
            }, onBeforeHide: function(self)
            {
                setTimeout(function()
                {
                    $body.addClass('ci_nav-off')
                }, 400);
                try
                {
                    self.drop.disablePageScroll('detachEvents')
                }
                catch(ex) {}
            }
    });
    jQuery('.ci-event-holder .ci-block').mobileNav({
        menuActiveClass: 'event-active', menuOpener: '.event-opener', hideOnClickOutside: true, menuDrop: '.event-slide'
    }).each(function()
    {
        var self = jQuery(this);
        var body = jQuery('body');
        var opener = self.find('.event-opener');
        opener.on('click', function(e)
        {
            e.preventDefault();
            var checkClass = self.hasClass('event-active');
            if (checkClass)
            {
                body.addClass('event-active')
            }
            else
            {
                body.removeClass('event-active')
            }
        });
        body.on('click', function(e)
        {
            var target = jQuery(e.target);
            var self = jQuery(this);
            if (!target.closest('.event-opener').length && !target.closest('.event-slide').length)
            {
                self.removeClass('event-active')
            }
        })
    });
    jQuery('.ci-event-list .ci-title').mobileNav({
        menuActiveClass: 'event-active', menuOpener: '.event-opener', hideOnClickOutside: true, menuDrop: '.event-slide'
    }).each(function()
    {
        var self = jQuery(this);
        var body = jQuery('body');
        var opener = self.find('.event-opener');
        opener.on('click', function(e)
        {
            e.preventDefault();
            var checkClass = self.hasClass('event-active');
            if (checkClass)
            {
                body.addClass('event-active')
            }
            else
            {
                body.removeClass('event-active')
            }
        });
        body.on('click', function(e)
        {
            var target = jQuery(e.target);
            var self = jQuery(this);
            if (!target.closest('.event-opener').length && !target.closest('.event-slide').length)
            {
                self.removeClass('event-active')
            }
        })
    })
}
;
(function($)
{
    function MobileNav(options)
    {
        this.options = $.extend({
            container: null, hideOnClickOutside: false, menuActiveClass: 'nav-active', menuOpener: '.nav-opener', menuDrop: '.nav-drop', toggleEvent: 'click', outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
        }, options);
        this.initStructure();
        this.attachEvents()
    }
    MobileNav.prototype = {
        initStructure: function()
        {
            this.page = $('html');
            this.container = $(this.options.container);
            this.opener = this.container.find(this.options.menuOpener);
            this.drop = this.container.find(this.options.menuDrop)
        }, attachEvents: function()
            {
                var self = this;
                if (activateResizeHandler)
                {
                    activateResizeHandler();
                    activateResizeHandler = null
                }
                this.outsideClickHandler = function(e)
                {
                    if (self.isOpened())
                    {
                        var target = $(e.target);
                        if (!target.closest(self.opener).length && !target.closest(self.drop).length)
                        {
                            if (target.parent().is('.goBackBurgerLvlBtn'))
                                return;
                            if (target.is('.goBackBurgerLvlBtn'))
                                return;
                            self.hide()
                        }
                    }
                };
                this.openerClickHandler = function(e)
                {
                    e.preventDefault();
                    self.toggle()
                };
                this.opener.on(this.options.toggleEvent, this.openerClickHandler)
            }, isOpened: function()
            {
                return this.container.hasClass(this.options.menuActiveClass)
            }, show: function()
            {
                this.makeCallback('onBeforeShow', this);
                this.container.addClass(this.options.menuActiveClass);
                if (this.options.hideOnClickOutside)
                {
                    this.page.on(this.options.outsideClickEvent, this.outsideClickHandler)
                }
            }, hide: function()
            {
                this.makeCallback('onBeforeHide', this);
                this.container.removeClass(this.options.menuActiveClass);
                if (this.options.hideOnClickOutside)
                {
                    this.page.off(this.options.outsideClickEvent, this.outsideClickHandler)
                }
            }, toggle: function()
            {
                if (this.isOpened())
                {
                    this.hide()
                }
                else
                {
                    this.show()
                }
            }, destroy: function()
            {
                this.container.removeClass(this.options.menuActiveClass);
                this.opener.off(this.options.toggleEvent, this.clickHandler);
                this.page.off(this.options.outsideClickEvent, this.outsideClickHandler)
            }, makeCallback: function(name)
            {
                if (typeof this.options[name] === 'function')
                {
                    var args = Array.prototype.slice.call(arguments);
                    args.shift();
                    this.options[name].apply(this, args)
                }
            }
    };
    var activateResizeHandler = function()
        {
            var win = $(window),
                doc = $('html'),
                resizeClass = 'resize-active',
                flag,
                timer;
            var removeClassHandler = function()
                {
                    flag = false;
                    doc.removeClass(resizeClass)
                };
            var resizeHandler = function()
                {
                    if (!flag)
                    {
                        flag = true;
                        doc.addClass(resizeClass)
                    }
                    clearTimeout(timer);
                    timer = setTimeout(removeClassHandler, 500)
                };
            win.on('resize orientationchange', resizeHandler)
        };
    $.fn.mobileNav = function(opt)
    {
        var args = Array.prototype.slice.call(arguments);
        var method = args[0];
        return this.each(function()
            {
                var $container = jQuery(this);
                var instance = $container.data('MobileNav');
                if (typeof opt === 'object' || typeof opt === 'undefined')
                {
                    $container.data('MobileNav', new MobileNav($.extend({container: this}, opt)))
                }
                else if (typeof method === 'string' && instance)
                {
                    if (typeof instance[method] === 'function')
                    {
                        args.shift();
                        instance[method].apply(instance, args)
                    }
                }
            })
    }
}(jQuery));
jQuery(function()
{
    multiLevelDrop()
});
function multiLevelDrop()
{
    var doc = jQuery(document);
    var list = 'li';
    var nav = jQuery('.ci_nav-top');
    var openers = nav.find('li > a .ico').add(nav.find('li > .ci_tnsectop'));
    var menuActiveClass = 'current-active';
    var close = jQuery('.go-back');
    var dropDown = '.dropmenu';
    var parentClass = 'parent-active';
    openers.on('click', function(e)
    {
        e.preventDefault();
        e.stopPropagation();
        var self = jQuery(this);
        var holder = self.closest(list);
        var dropmenu = holder.find(dropDown);
        if (dropmenu.length)
        {
            e.preventDefault();
            holder.toggleClass(menuActiveClass);
            if (!nav.hasClass(parentClass))
            {
                nav.addClass(parentClass)
            }
            if (!holder.closest(dropDown).hasClass(parentClass))
            {
                holder.closest(dropDown).addClass(parentClass)
            }
        }
    });
    close.on('click', function(e)
    {
        e.preventDefault();
        var self = jQuery(this);
        self.closest(list).toggleClass(menuActiveClass);
        if (self.closest('.' + parentClass).hasClass(parentClass))
        {
            self.closest('.' + parentClass).removeClass(parentClass)
        }
    });
    doc.on('click', function(e)
    {
        if (!nav.is(e.target) && nav.has(e.target).length === 0)
        {
            var holder = nav.find(list);
            holder.each(function()
            {
                var self = jQuery(this);
                if (self.hasClass(menuActiveClass))
                {
                    self.removeClass(menuActiveClass)
                }
                if (nav.hasClass(parentClass))
                {
                    nav.removeClass(parentClass)
                }
                if (self.find(dropDown).hasClass(parentClass))
                {
                    self.find(dropDown).removeClass(parentClass)
                }
            })
        }
    })
}
;
/*! Picturefill - v3.0.1 - 2015-09-30
 * http://scottjehl.github.io/picturefill
 * Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
 */
!function(a)
{
    var b = navigator.userAgent;
    a.HTMLPictureElement && /ecko/.test(b) && b.match(/rv\:(\d+)/) && RegExp.$1 < 41 && addEventListener("resize", function()
    {
        var b,
            c = document.createElement("source"),
            d = function(a)
            {
                var b,
                    d,
                    e = a.parentNode;
                "PICTURE" === e.nodeName.toUpperCase() ? (b = c.cloneNode(), e.insertBefore(b, e.firstElementChild), setTimeout(function()
                    {
                        e.removeChild(b)
                    })) : (!a._pfLastSize || a.offsetWidth > a._pfLastSize) && (a._pfLastSize = a.offsetWidth, d = a.sizes, a.sizes += ",100vw", setTimeout(function()
                    {
                        a.sizes = d
                    }))
            },
            e = function()
            {
                var a,
                    b = document.querySelectorAll("picture > img, img[srcset][sizes]");
                for (a = 0; a < b.length; a++)
                    d(b[a])
            },
            f = function()
            {
                clearTimeout(b),
                b = setTimeout(e, 99)
            },
            g = a.matchMedia && matchMedia("(orientation: landscape)"),
            h = function()
            {
                f(),
                g && g.addListener && g.addListener(f)
            };
        return c.srcset = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", /^[c|i]|d$/.test(document.readyState || "") ? h() : document.addEventListener("DOMContentLoaded", h), f
    }())
}(window),
function(a, b, c)
{
    "use strict";
    function d(a)
    {
        return " " === a || "	" === a || "\n" === a || "\f" === a || "\r" === a
    }
    function e(b, c)
    {
        var d = new a.Image;
        return d.onerror = function()
            {
                z[b] = !1,
                aa()
            }, d.onload = function()
            {
                z[b] = 1 === d.width,
                aa()
            }, d.src = c, "pending"
    }
    function f()
    {
        L = !1,
        O = a.devicePixelRatio,
        M = {},
        N = {},
        s.DPR = O || 1,
        P.width = Math.max(a.innerWidth || 0, y.clientWidth),
        P.height = Math.max(a.innerHeight || 0, y.clientHeight),
        P.vw = P.width / 100,
        P.vh = P.height / 100,
        r = [P.height, P.width, O].join("-"),
        P.em = s.getEmValue(),
        P.rem = P.em
    }
    function g(a, b, c, d)
    {
        var e,
            f,
            g,
            h;
        return "saveData" === A.algorithm ? a > 2.7 ? h = c + 1 : (f = b - c, e = Math.pow(a - .6, 1.5), g = f * e, d && (g += .1 * e), h = a + g) : h = c > 1 ? Math.sqrt(a * b) : a, h > c
    }
    function h(a)
    {
        var b,
            c = s.getSet(a),
            d = !1;
        "pending" !== c && (d = r, c && (b = s.setRes(c), s.applySetCandidate(b, a))),
        a[s.ns].evaled = d
    }
    function i(a, b)
    {
        return a.res - b.res
    }
    function j(a, b, c)
    {
        var d;
        return !c && b && (c = a[s.ns].sets, c = c && c[c.length - 1]), d = k(b, c), d && (b = s.makeUrl(b), a[s.ns].curSrc = b, a[s.ns].curCan = d, d.res || _(d, d.set.sizes)), d
    }
    function k(a, b)
    {
        var c,
            d,
            e;
        if (a && b)
            for (e = s.parseSet(b), a = s.makeUrl(a), c = 0; c < e.length; c++)
                if (a === s.makeUrl(e[c].url))
                {
                    d = e[c];
                    break
                }
        return d
    }
    function l(a, b)
    {
        var c,
            d,
            e,
            f,
            g = a.getElementsByTagName("source");
        for (c = 0, d = g.length; d > c; c++)
            e = g[c],
            e[s.ns] = !0,
            f = e.getAttribute("srcset"),
            f && b.push({
                srcset: f, media: e.getAttribute("media"), type: e.getAttribute("type"), sizes: e.getAttribute("sizes")
            })
    }
    function m(a, b)
    {
        function c(b)
        {
            var c,
                d = b.exec(a.substring(m));
            return d ? (c = d[0], m += c.length, c) : void 0
        }
        function e()
        {
            var a,
                c,
                d,
                e,
                f,
                i,
                j,
                k,
                l,
                m = !1,
                o = {};
            for (e = 0; e < h.length; e++)
                f = h[e],
                i = f[f.length - 1],
                j = f.substring(0, f.length - 1),
                k = parseInt(j, 10),
                l = parseFloat(j),
                W.test(j) && "w" === i ? ((a || c) && (m = !0), 0 === k ? m = !0 : a = k) : X.test(j) && "x" === i ? ((a || c || d) && (m = !0), 0 > l ? m = !0 : c = l) : W.test(j) && "h" === i ? ((d || c) && (m = !0), 0 === k ? m = !0 : d = k) : m = !0;
            m || (o.url = g, a && (o.w = a), c && (o.d = c), d && (o.h = d), d || c || a || (o.d = 1), 1 === o.d && (b.has1x = !0), o.set = b, n.push(o))
        }
        function f()
        {
            for (c(S), i = "", j = "in descriptor"; ; )
            {
                if (k = a.charAt(m), "in descriptor" === j)
                    if (d(k))
                        i && (h.push(i), i = "", j = "after descriptor");
                    else
                    {
                        if ("," === k)
                            return m += 1, i && h.push(i), void e();
                        if ("(" === k)
                            i += k,
                            j = "in parens";
                        else
                        {
                            if ("" === k)
                                return i && h.push(i), void e();
                            i += k
                        }
                    }
                else if ("in parens" === j)
                    if (")" === k)
                        i += k,
                        j = "in descriptor";
                    else
                    {
                        if ("" === k)
                            return h.push(i), void e();
                        i += k
                    }
                else if ("after descriptor" === j)
                    if (d(k))
                        ;
                    else
                    {
                        if ("" === k)
                            return void e();
                        j = "in descriptor",
                        m -= 1
                    }
                m += 1
            }
        }
        for (var g, h, i, j, k, l = a.length, m = 0, n = []; ; )
        {
            if (c(T), m >= l)
                return n;
            g = c(U),
            h = [],
            "," === g.slice(-1) ? (g = g.replace(V, ""), e()) : f()
        }
    }
    function n(a)
    {
        function b(a)
        {
            function b()
            {
                f && (g.push(f), f = "")
            }
            function c()
            {
                g[0] && (h.push(g), g = [])
            }
            for (var e, f = "", g = [], h = [], i = 0, j = 0, k = !1; ; )
            {
                if (e = a.charAt(j), "" === e)
                    return b(), c(), h;
                if (k)
                {
                    if ("*" === e && "/" === a[j + 1])
                    {
                        k = !1,
                        j += 2,
                        b();
                        continue
                    }
                    j += 1
                }
                else
                {
                    if (d(e))
                    {
                        if (a.charAt(j - 1) && d(a.charAt(j - 1)) || !f)
                        {
                            j += 1;
                            continue
                        }
                        if (0 === i)
                        {
                            b(),
                            j += 1;
                            continue
                        }
                        e = " "
                    }
                    else if ("(" === e)
                        i += 1;
                    else if (")" === e)
                        i -= 1;
                    else
                    {
                        if ("," === e)
                        {
                            b(),
                            c(),
                            j += 1;
                            continue
                        }
                        if ("/" === e && "*" === a.charAt(j + 1))
                        {
                            k = !0,
                            j += 2;
                            continue
                        }
                    }
                    f += e,
                    j += 1
                }
            }
        }
        function c(a)
        {
            return k.test(a) && parseFloat(a) >= 0 ? !0 : l.test(a) ? !0 : "0" === a || "-0" === a || "+0" === a ? !0 : !1
        }
        var e,
            f,
            g,
            h,
            i,
            j,
            k = /^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i,
            l = /^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;
        for (f = b(a), g = f.length, e = 0; g > e; e++)
            if (h = f[e], i = h[h.length - 1], c(i))
            {
                if (j = i, h.pop(), 0 === h.length)
                    return j;
                if (h = h.join(" "), s.matchesMedia(h))
                    return j
            }
        return "100vw"
    }
    b.createElement("picture");
    var o,
        p,
        q,
        r,
        s = {},
        t = function(){},
        u = b.createElement("img"),
        v = u.getAttribute,
        w = u.setAttribute,
        x = u.removeAttribute,
        y = b.documentElement,
        z = {},
        A = {algorithm: ""},
        B = "data-pfsrc",
        C = B + "set",
        D = navigator.userAgent,
        E = /rident/.test(D) || /ecko/.test(D) && D.match(/rv\:(\d+)/) && RegExp.$1 > 35,
        F = "currentSrc",
        G = /\s+\+?\d+(e\d+)?w/,
        H = /(\([^)]+\))?\s*(.+)/,
        I = a.picturefillCFG,
        J = "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)",
        K = "font-size:100%!important;",
        L = !0,
        M = {},
        N = {},
        O = a.devicePixelRatio,
        P = {
            px: 1, "in": 96
        },
        Q = b.createElement("a"),
        R = !1,
        S = /^[ \t\n\r\u000c]+/,
        T = /^[, \t\n\r\u000c]+/,
        U = /^[^ \t\n\r\u000c]+/,
        V = /[,]+$/,
        W = /^\d+$/,
        X = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/,
        Y = function(a, b, c, d)
        {
            a.addEventListener ? a.addEventListener(b, c, d || !1) : a.attachEvent && a.attachEvent("on" + b, c)
        },
        Z = function(a)
        {
            var b = {};
            return function(c)
                {
                    return c in b || (b[c] = a(c)), b[c]
                }
        },
        $ = function()
        {
            var a = /^([\d\.]+)(em|vw|px)$/,
                b = function()
                {
                    for (var a = arguments, b = 0, c = a[0]; ++b in a; )
                        c = c.replace(a[b], a[++b]);
                    return c
                },
                c = Z(function(a)
                {
                    return "return " + b((a || "").toLowerCase(), /\band\b/g, "&&", /,/g, "||", /min-([a-z-\s]+):/g, "e.$1>=", /max-([a-z-\s]+):/g, "e.$1<=", /calc([^)]+)/g, "($1)", /(\d+[\.]*[\d]*)([a-z]+)/g, "($1 * e.$2)", /^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi, "") + ";"
                });
            return function(b, d)
                {
                    var e;
                    if (!(b in M))
                        if (M[b] = !1, d && (e = b.match(a)))
                            M[b] = e[1] * P[e[2]];
                        else
                            try
                            {
                                M[b] = new Function("e", c(b))(P)
                            }
                            catch(f) {}
                    return M[b]
                }
        }(),
        _ = function(a, b)
        {
            return a.w ? (a.cWidth = s.calcListLength(b || "100vw"), a.res = a.w / a.cWidth) : a.res = a.d, a
        },
        aa = function(a)
        {
            var c,
                d,
                e,
                f = a || {};
            if (f.elements && 1 === f.elements.nodeType && ("IMG" === f.elements.nodeName.toUpperCase() ? f.elements = [f.elements] : (f.context = f.elements, f.elements = null)), c = f.elements || s.qsa(f.context || b, f.reevaluate || f.reselect ? s.sel : s.selShort), e = c.length)
            {
                for (s.setupRun(f), R = !0, d = 0; e > d; d++)
                    s.fillImg(c[d], f);
                s.teardownRun(f)
            }
        };
    o = a.console && console.warn ? function(a)
    {
        console.warn(a)
    } : t,
    F in u || (F = "src"),
    z["image/jpeg"] = !0,
    z["image/gif"] = !0,
    z["image/png"] = !0,
    z["image/svg+xml"] = b.implementation.hasFeature("http://wwwindow.w3.org/TR/SVG11/feature#Image", "1.1"),
    s.ns = ("pf" + (new Date).getTime()).substr(0, 9),
    s.supSrcset = "srcset" in u,
    s.supSizes = "sizes" in u,
    s.supPicture = !!a.HTMLPictureElement,
    s.supSrcset && s.supPicture && !s.supSizes && !function(a)
    {
        u.srcset = "data:,a",
        a.src = "data:,a",
        s.supSrcset = u.complete === a.complete,
        s.supPicture = s.supSrcset && s.supPicture
    }(b.createElement("img")),
    s.selShort = "picture>img,img[srcset]",
    s.sel = s.selShort,
    s.cfg = A,
    s.supSrcset && (s.sel += ",img[" + C + "]"),
    s.DPR = O || 1,
    s.u = P,
    s.types = z,
    q = s.supSrcset && !s.supSizes,
    s.setSize = t,
    s.makeUrl = Z(function(a)
    {
        return Q.href = a, Q.href
    }),
    s.qsa = function(a, b)
    {
        return a.querySelectorAll(b)
    },
    s.matchesMedia = function()
    {
        return a.matchMedia && (matchMedia("(min-width: 0.1em)") || {}).matches ? s.matchesMedia = function(a)
            {
                return !a || matchMedia(a).matches
            } : s.matchesMedia = s.mMQ, s.matchesMedia.apply(this, arguments)
    },
    s.mMQ = function(a)
    {
        return a ? $(a) : !0
    },
    s.calcLength = function(a)
    {
        var b = $(a, !0) || !1;
        return 0 > b && (b = !1), b
    },
    s.supportsType = function(a)
    {
        return a ? z[a] : !0
    },
    s.parseSize = Z(function(a)
    {
        var b = (a || "").match(H);
        return {
                media: b && b[1], length: b && b[2]
            }
    }),
    s.parseSet = function(a)
    {
        return a.cands || (a.cands = m(a.srcset, a)), a.cands
    },
    s.getEmValue = function()
    {
        var a;
        if (!p && (a = b.body))
        {
            var c = b.createElement("div"),
                d = y.style.cssText,
                e = a.style.cssText;
            c.style.cssText = J,
            y.style.cssText = K,
            a.style.cssText = K,
            a.appendChild(c),
            p = c.offsetWidth,
            a.removeChild(c),
            p = parseFloat(p, 10),
            y.style.cssText = d,
            a.style.cssText = e
        }
        return p || 16
    },
    s.calcListLength = function(a)
    {
        if (!(a in N) || A.uT)
        {
            var b = s.calcLength(n(a));
            N[a] = b ? b : P.width
        }
        return N[a]
    },
    s.setRes = function(a)
    {
        var b;
        if (a)
        {
            b = s.parseSet(a);
            for (var c = 0, d = b.length; d > c; c++)
                _(b[c], a.sizes)
        }
        return b
    },
    s.setRes.res = _,
    s.applySetCandidate = function(a, b)
    {
        if (a.length)
        {
            var c,
                d,
                e,
                f,
                h,
                k,
                l,
                m,
                n,
                o = b[s.ns],
                p = s.DPR;
            if (k = o.curSrc || b[F], l = o.curCan || j(b, k, a[0].set), l && l.set === a[0].set && (n = E && !b.complete && l.res - .1 > p, n || (l.cached = !0, l.res >= p && (h = l))), !h)
                for (a.sort(i), f = a.length, h = a[f - 1], d = 0; f > d; d++)
                    if (c = a[d], c.res >= p)
                    {
                        e = d - 1,
                        h = a[e] && (n || k !== s.makeUrl(c.url)) && g(a[e].res, c.res, p, a[e].cached) ? a[e] : c;
                        break
                    }
            h && (m = s.makeUrl(h.url), o.curSrc = m, o.curCan = h, m !== k && s.setSrc(b, h), s.setSize(b))
        }
    },
    s.setSrc = function(a, b)
    {
        var c;
        a.src = b.url,
        "image/svg+xml" === b.set.type && (c = a.style.width, a.style.width = a.offsetWidth + 1 + "px", a.offsetWidth + 1 && (a.style.width = c))
    },
    s.getSet = function(a)
    {
        var b,
            c,
            d,
            e = !1,
            f = a[s.ns].sets;
        for (b = 0; b < f.length && !e; b++)
            if (c = f[b], c.srcset && s.matchesMedia(c.media) && (d = s.supportsType(c.type)))
            {
                "pending" === d && (c = d),
                e = c;
                break
            }
        return e
    },
    s.parseSets = function(a, b, d)
    {
        var e,
            f,
            g,
            h,
            i = b && "PICTURE" === b.nodeName.toUpperCase(),
            j = a[s.ns];
        (j.src === c || d.src) && (j.src = v.call(a, "src"), j.src ? w.call(a, B, j.src) : x.call(a, B)),
        (j.srcset === c || d.srcset || !s.supSrcset || a.srcset) && (e = v.call(a, "srcset"), j.srcset = e, h = !0),
        j.sets = [],
        i && (j.pic = !0, l(b, j.sets)),
        j.srcset ? (f = {
            srcset: j.srcset, sizes: v.call(a, "sizes")
        }, j.sets.push(f), g = (q || j.src) && G.test(j.srcset || ""), g || !j.src || k(j.src, f) || f.has1x || (f.srcset += ", " + j.src, f.cands.push({
                url: j.src, d: 1, set: f
            }))) : j.src && j.sets.push({
            srcset: j.src, sizes: null
        }),
        j.curCan = null,
        j.curSrc = c,
        j.supported = !(i || f && !s.supSrcset || g),
        h && s.supSrcset && !j.supported && (e ? (w.call(a, C, e), a.srcset = "") : x.call(a, C)),
        j.supported && !j.srcset && (!j.src && a.src || a.src !== s.makeUrl(j.src)) && (null === j.src ? a.removeAttribute("src") : a.src = j.src),
        j.parsed = !0
    },
    s.fillImg = function(a, b)
    {
        var c,
            d = b.reselect || b.reevaluate;
        a[s.ns] || (a[s.ns] = {}),
        c = a[s.ns],
        (d || c.evaled !== r) && ((!c.parsed || b.reevaluate) && s.parseSets(a, a.parentNode, b), c.supported ? c.evaled = r : h(a))
    },
    s.setupRun = function()
    {
        (!R || L || O !== a.devicePixelRatio) && f()
    },
    s.supPicture ? (aa = t, s.fillImg = t) : !function()
    {
        var c,
            d = a.attachEvent ? /d$|^c/ : /d$|^c|^i/,
            e = function()
            {
                var a = b.readyState || "";
                f = setTimeout(e, "loading" === a ? 200 : 999),
                b.body && (s.fillImgs(), c = c || d.test(a), c && clearTimeout(f))
            },
            f = setTimeout(e, b.body ? 9 : 99),
            g = function(a, b)
            {
                var c,
                    d,
                    e = function()
                    {
                        var f = new Date - d;
                        b > f ? c = setTimeout(e, b - f) : (c = null, a())
                    };
                return function()
                    {
                        d = new Date,
                        c || (c = setTimeout(e, b))
                    }
            },
            h = y.clientHeight,
            i = function()
            {
                L = Math.max(a.innerWidth || 0, y.clientWidth) !== P.width || y.clientHeight !== h,
                h = y.clientHeight,
                L && s.fillImgs()
            };
        Y(a, "resize", g(i, 99)),
        Y(b, "readystatechange", e)
    }(),
    s.picturefill = aa,
    s.fillImgs = aa,
    s.teardownRun = t,
    aa._ = s,
    a.picturefillCFG = {
        pf: s, push: function(a)
            {
                var b = a.shift();
                "function" == typeof s[b] ? s[b].apply(s, a) : (A[b] = a[0], R && s.fillImgs({reselect: !0}))
            }
    };
    for (; I && I.length; )
        a.picturefillCFG.push(I.shift());
    a.picturefill = aa,
    "object" == typeof module && "object" == typeof module.exports ? module.exports = aa : "function" == typeof define && define.amd && define("picturefill", function()
    {
        return aa
    }),
    s.supPicture || (z["image/webp"] = e("image/webp", "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA=="))
}(window, document);
function initRetinaCover()
{
    jQuery(".bg-stretch").retinaCover()
}
jQuery(function()
{
    initRetinaCover()
}),
function(t)
{
    "use strict";
    var i = {},
        e = {
            "2x": ["(-webkit-min-device-pixel-ratio: 1.5)", "(min-resolution: 192dpi)", "(min-device-pixel-ratio: 1.5)", "(min-resolution: 1.5dppx)"], "3x": ["(-webkit-min-device-pixel-ratio: 3)", "(min-resolution: 384dpi)", "(min-device-pixel-ratio: 3)", "(min-resolution: 3dppx)"]
        };
    function n(t, i, e)
    {
        o(i, a(e, t))
    }
    function r(i, n, r)
    {
        var u = e[i[1]].slice(),
            c = u,
            d = a(r, i[0]);
        "default" !== n && (c = t.map(u, function(t, i)
        {
            return t + " and " + n
        })),
        o(n = c.join(","), d)
    }
    function a(t, i)
    {
        return "#" + t + '{background-image: url("' + i + '");}'
    }
    function o(e, n)
    {
        var r,
            a = i[e],
            o = "";
        o = "default" === e ? n + " " : "@media " + e + "{" + n + "}",
        a ? (r = (r = a.text()).substring(0, r.length - 2) + " }" + n + "}", a.text(r)) : i[e] = t("<style>").text(o).appendTo("head")
    }
    t.fn.retinaCover = function()
    {
        return this.each(function()
            {
                var i = t(this),
                    e = i.children("[data-srcset]"),
                    a = "bg-stretch" + Date.now() + (1e3 * Math.random()).toFixed(0);
                e.length && (i.attr("id", a), e.each(function()
                {
                    var i,
                        e,
                        o = t(this),
                        u = o.data("srcset").split(", "),
                        c = o.data("media") || "default",
                        d = u.length;
                    for (e = 0; e < d; e++)
                        1 === (i = u[e].split(" ")).length ? n(i[0], c, a) : r(i, c, a)
                })),
                e.detach()
            })
    }
}(jQuery);
function initSlickCarousel()
{
    jQuery(".slick-slider").slick({
        slidesToScroll: 1, rows: 0, prevArrow: '<button class="slick-prev" aria-label="Slick Previous"><span class="icon icon-left-arrow"></span></button>', nextArrow: '<button class="slick-next" aria-label="Slick Next"><span class="icon icon-right-arrow"></span></button>', dots: !0, fade: !0, autoplay: !0, autoplaySpeed: 8e3
    })
}
jQuery(function()
{
    initSlickCarousel()
}),
function(i)
{
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], i) : "undefined" != typeof exports ? module.exports = i(require("jquery")) : i(jQuery)
}(function(i)
{
    "use strict";
    var e = window.Slick || {};
    (e = function()
    {
        var e = 0;
        return function(t, o)
            {
                var s,
                    n = this;
                n.defaults = {
                    accessibility: !0, adaptiveHeight: !1, appendArrows: i(t), appendDots: i(t), arrows: !0, asNavFor: null, prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>', nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>', autoplay: !1, autoplaySpeed: 3e3, centerMode: !1, centerPadding: "50px", cssEase: "ease", customPaging: function(e, t)
                        {
                            return i('<button type="button" />').text(t + 1)
                        }, dots: !1, dotsClass: "slick-dots", draggable: !0, easing: "linear", edgeFriction: .35, fade: !1, focusOnSelect: !1, focusOnChange: !1, infinite: !0, initialSlide: 0, lazyLoad: "ondemand", mobileFirst: !1, pauseOnHover: !0, pauseOnFocus: !0, pauseOnDotsHover: !1, respondTo: "window", responsive: null, rows: 1, rtl: !1, slide: "", slidesPerRow: 1, slidesToShow: 1, slidesToScroll: 1, speed: 500, swipe: !0, swipeToSlide: !1, touchMove: !0, touchThreshold: 5, useCSS: !0, useTransform: !0, variableWidth: !1, vertical: !1, verticalSwiping: !1, waitForAnimate: !0, zIndex: 1e3
                },
                n.initials = {
                    animating: !1, dragging: !1, autoPlayTimer: null, currentDirection: 0, currentLeft: null, currentSlide: 0, direction: 1, $dots: null, listWidth: null, listHeight: null, loadIndex: 0, $nextArrow: null, $prevArrow: null, scrolling: !1, slideCount: null, slideWidth: null, $slideTrack: null, $slides: null, sliding: !1, slideOffset: 0, swipeLeft: null, swiping: !1, $list: null, touchObject: {}, transformsEnabled: !1, unslicked: !1
                },
                i.extend(n, n.initials),
                n.activeBreakpoint = null,
                n.animType = null,
                n.animProp = null,
                n.breakpoints = [],
                n.breakpointSettings = [],
                n.cssTransitions = !1,
                n.focussed = !1,
                n.interrupted = !1,
                n.hidden = "hidden",
                n.paused = !0,
                n.positionProp = null,
                n.respondTo = null,
                n.rowCount = 1,
                n.shouldClick = !0,
                n.$slider = i(t),
                n.$slidesCache = null,
                n.transformType = null,
                n.transitionType = null,
                n.visibilityChange = "visibilitychange",
                n.windowWidth = 0,
                n.windowTimer = null,
                s = i(t).data("slick") || {},
                n.options = i.extend({}, n.defaults, o, s),
                n.currentSlide = n.options.initialSlide,
                n.originalSettings = n.options,
                void 0 !== document.mozHidden ? (n.hidden = "mozHidden", n.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (n.hidden = "webkitHidden", n.visibilityChange = "webkitvisibilitychange"),
                n.autoPlay = i.proxy(n.autoPlay, n),
                n.autoPlayClear = i.proxy(n.autoPlayClear, n),
                n.autoPlayIterator = i.proxy(n.autoPlayIterator, n),
                n.changeSlide = i.proxy(n.changeSlide, n),
                n.clickHandler = i.proxy(n.clickHandler, n),
                n.selectHandler = i.proxy(n.selectHandler, n),
                n.setPosition = i.proxy(n.setPosition, n),
                n.swipeHandler = i.proxy(n.swipeHandler, n),
                n.dragHandler = i.proxy(n.dragHandler, n),
                n.keyHandler = i.proxy(n.keyHandler, n),
                n.instanceUid = e++,
                n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/,
                n.registerBreakpoints(),
                n.init(!0)
            }
    }()).prototype.activateADA = function()
    {
        this.$slideTrack.find(".slick-active").attr({"aria-hidden": "false"}).find("a, input, button, select").attr({tabindex: "0"})
    },
    e.prototype.addSlide = e.prototype.slickAdd = function(e, t, o)
    {
        var s = this;
        if ("boolean" == typeof t)
            o = t,
            t = null;
        else if (t < 0 || t >= s.slideCount)
            return !1;
        s.unload(),
        "number" == typeof t ? 0 === t && 0 === s.$slides.length ? i(e).appendTo(s.$slideTrack) : o ? i(e).insertBefore(s.$slides.eq(t)) : i(e).insertAfter(s.$slides.eq(t)) : !0 === o ? i(e).prependTo(s.$slideTrack) : i(e).appendTo(s.$slideTrack),
        s.$slides = s.$slideTrack.children(this.options.slide),
        s.$slideTrack.children(this.options.slide).detach(),
        s.$slideTrack.append(s.$slides),
        s.$slides.each(function(e, t)
        {
            i(t).attr("data-slick-index", e)
        }),
        s.$slidesCache = s.$slides,
        s.reinit()
    },
    e.prototype.animateHeight = function()
    {
        var i = this;
        if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical)
        {
            var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
            i.$list.animate({height: e}, i.options.speed)
        }
    },
    e.prototype.animateSlide = function(e, t)
    {
        var o = {},
            s = this;
        s.animateHeight(),
        !0 === s.options.rtl && !1 === s.options.vertical && (e = -e),
        !1 === s.transformsEnabled ? !1 === s.options.vertical ? s.$slideTrack.animate({left: e}, s.options.speed, s.options.easing, t) : s.$slideTrack.animate({top: e}, s.options.speed, s.options.easing, t) : !1 === s.cssTransitions ? (!0 === s.options.rtl && (s.currentLeft = -s.currentLeft), i({animStart: s.currentLeft}).animate({animStart: e}, {
            duration: s.options.speed, easing: s.options.easing, step: function(i)
                {
                    i = Math.ceil(i),
                    !1 === s.options.vertical ? (o[s.animType] = "translate(" + i + "px, 0px)", s.$slideTrack.css(o)) : (o[s.animType] = "translate(0px," + i + "px)", s.$slideTrack.css(o))
                }, complete: function()
                {
                    t && t.call()
                }
        })) : (s.applyTransition(), e = Math.ceil(e), !1 === s.options.vertical ? o[s.animType] = "translate3d(" + e + "px, 0px, 0px)" : o[s.animType] = "translate3d(0px," + e + "px, 0px)", s.$slideTrack.css(o), t && setTimeout(function()
            {
                s.disableTransition(),
                t.call()
            }, s.options.speed))
    },
    e.prototype.getNavTarget = function()
    {
        var e = this.options.asNavFor;
        return e && null !== e && (e = i(e).not(this.$slider)), e
    },
    e.prototype.asNavFor = function(e)
    {
        var t = this.getNavTarget();
        null !== t && "object" == typeof t && t.each(function()
        {
            var t = i(this).slick("getSlick");
            t.unslicked || t.slideHandler(e, !0)
        })
    },
    e.prototype.applyTransition = function(i)
    {
        var e = this,
            t = {};
        !1 === e.options.fade ? t[e.transitionType] = e.transformType + " " + e.options.speed + "ms " + e.options.cssEase : t[e.transitionType] = "opacity " + e.options.speed + "ms " + e.options.cssEase,
        !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t)
    },
    e.prototype.autoPlay = function()
    {
        var i = this;
        i.autoPlayClear(),
        i.slideCount > i.options.slidesToShow && (i.autoPlayTimer = setInterval(i.autoPlayIterator, i.options.autoplaySpeed))
    },
    e.prototype.autoPlayClear = function()
    {
        this.autoPlayTimer && clearInterval(this.autoPlayTimer)
    },
    e.prototype.autoPlayIterator = function()
    {
        var i = this,
            e = i.currentSlide + i.options.slidesToScroll;
        i.paused || i.interrupted || i.focussed || (!1 === i.options.infinite && (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1 ? i.direction = 0 : 0 === i.direction && (e = i.currentSlide - i.options.slidesToScroll, i.currentSlide - 1 == 0 && (i.direction = 1))), i.slideHandler(e))
    },
    e.prototype.buildArrows = function()
    {
        var e = this;
        !0 === e.options.arrows && (e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow"), e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow"), e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows), e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows), !0 !== e.options.infinite && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
                "aria-disabled": "true", tabindex: "-1"
            }))
    },
    e.prototype.buildDots = function()
    {
        var e,
            t,
            o = this;
        if (!0 === o.options.dots && o.slideCount > o.options.slidesToShow)
        {
            for (o.$slider.addClass("slick-dotted"), t = i("<ul />").addClass(o.options.dotsClass), e = 0; e <= o.getDotCount(); e += 1)
                t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
            o.$dots = t.appendTo(o.options.appendDots),
            o.$dots.find("li").first().addClass("slick-active")
        }
    },
    e.prototype.buildOut = function()
    {
        var e = this;
        e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"),
        e.slideCount = e.$slides.length,
        e.$slides.each(function(e, t)
        {
            i(t).attr("data-slick-index", e).data("originalStyling", i(t).attr("style") || "")
        }),
        e.$slider.addClass("slick-slider"),
        e.$slideTrack = 0 === e.slideCount ? i('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(),
        e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent(),
        e.$slideTrack.css("opacity", 0),
        !0 !== e.options.centerMode && !0 !== e.options.swipeToSlide || (e.options.slidesToScroll = 1),
        i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"),
        e.setupInfinite(),
        e.buildArrows(),
        e.buildDots(),
        e.updateDots(),
        e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0),
        !0 === e.options.draggable && e.$list.addClass("draggable")
    },
    e.prototype.buildRows = function()
    {
        var i,
            e,
            t,
            o,
            s,
            n,
            r,
            l = this;
        if (o = document.createDocumentFragment(), n = l.$slider.children(), l.options.rows > 0)
        {
            for (r = l.options.slidesPerRow * l.options.rows, s = Math.ceil(n.length / r), i = 0; i < s; i++)
            {
                var d = document.createElement("div");
                for (e = 0; e < l.options.rows; e++)
                {
                    var a = document.createElement("div");
                    for (t = 0; t < l.options.slidesPerRow; t++)
                    {
                        var c = i * r + (e * l.options.slidesPerRow + t);
                        n.get(c) && a.appendChild(n.get(c))
                    }
                    d.appendChild(a)
                }
                o.appendChild(d)
            }
            l.$slider.empty().append(o),
            l.$slider.children().children().children().css({
                width: 100 / l.options.slidesPerRow + "%", display: "inline-block"
            })
        }
    },
    e.prototype.checkResponsive = function(e, t)
    {
        var o,
            s,
            n,
            r = this,
            l = !1,
            d = r.$slider.width(),
            a = window.innerWidth || i(window).width();
        if ("window" === r.respondTo ? n = a : "slider" === r.respondTo ? n = d : "min" === r.respondTo && (n = Math.min(a, d)), r.options.responsive && r.options.responsive.length && null !== r.options.responsive)
        {
            for (o in s = null, r.breakpoints)
                r.breakpoints.hasOwnProperty(o) && (!1 === r.originalSettings.mobileFirst ? n < r.breakpoints[o] && (s = r.breakpoints[o]) : n > r.breakpoints[o] && (s = r.breakpoints[o]));
            null !== s ? null !== r.activeBreakpoint ? (s !== r.activeBreakpoint || t) && (r.activeBreakpoint = s, "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : (r.activeBreakpoint = s, "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : null !== r.activeBreakpoint && (r.activeBreakpoint = null, r.options = r.originalSettings, !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e), l = s),
            e || !1 === l || r.$slider.trigger("breakpoint", [r, l])
        }
    },
    e.prototype.changeSlide = function(e, t)
    {
        var o,
            s,
            n = this,
            r = i(e.currentTarget);
        switch (r.is("a") && e.preventDefault(), r.is("li") || (r = r.closest("li")), o = n.slideCount % n.options.slidesToScroll != 0 ? 0 : (n.slideCount - n.currentSlide) % n.options.slidesToScroll, e.data.message)
        {
            case"previous":
                s = 0 === o ? n.options.slidesToScroll : n.options.slidesToShow - o,
                n.slideCount > n.options.slidesToShow && n.slideHandler(n.currentSlide - s, !1, t);
                break;
            case"next":
                s = 0 === o ? n.options.slidesToScroll : o,
                n.slideCount > n.options.slidesToShow && n.slideHandler(n.currentSlide + s, !1, t);
                break;
            case"index":
                var l = 0 === e.data.index ? 0 : e.data.index || r.index() * n.options.slidesToScroll;
                n.slideHandler(n.checkNavigable(l), !1, t),
                r.children().trigger("focus");
                break;
            default:
                return
        }
    },
    e.prototype.checkNavigable = function(i)
    {
        var e,
            t;
        if (t = 0, i > (e = this.getNavigableIndexes())[e.length - 1])
            i = e[e.length - 1];
        else
            for (var o in e)
            {
                if (i < e[o])
                {
                    i = t;
                    break
                }
                t = e[o]
            }
        return i
    },
    e.prototype.cleanUpEvents = function()
    {
        var e = this;
        e.options.dots && null !== e.$dots && (i("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", i.proxy(e.interrupt, e, !0)).off("mouseleave.slick", i.proxy(e.interrupt, e, !1)), !0 === e.options.accessibility && e.$dots.off("keydown.slick", e.keyHandler)),
        e.$slider.off("focus.slick blur.slick"),
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide), e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler), e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))),
        e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler),
        e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler),
        e.$list.off("touchend.slick mouseup.slick", e.swipeHandler),
        e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler),
        e.$list.off("click.slick", e.clickHandler),
        i(document).off(e.visibilityChange, e.visibility),
        e.cleanUpSlideEvents(),
        !0 === e.options.accessibility && e.$list.off("keydown.slick", e.keyHandler),
        !0 === e.options.focusOnSelect && i(e.$slideTrack).children().off("click.slick", e.selectHandler),
        i(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange),
        i(window).off("resize.slick.slick-" + e.instanceUid, e.resize),
        i("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault),
        i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition)
    },
    e.prototype.cleanUpSlideEvents = function()
    {
        var e = this;
        e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
        e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1))
    },
    e.prototype.cleanUpRows = function()
    {
        var i,
            e = this;
        e.options.rows > 0 && ((i = e.$slides.children().children()).removeAttr("style"), e.$slider.empty().append(i))
    },
    e.prototype.clickHandler = function(i)
    {
        !1 === this.shouldClick && (i.stopImmediatePropagation(), i.stopPropagation(), i.preventDefault())
    },
    e.prototype.destroy = function(e)
    {
        var t = this;
        t.autoPlayClear(),
        t.touchObject = {},
        t.cleanUpEvents(),
        i(".slick-cloned", t.$slider).detach(),
        t.$dots && t.$dots.remove(),
        t.$prevArrow && t.$prevArrow.length && (t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()),
        t.$nextArrow && t.$nextArrow.length && (t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()),
        t.$slides && (t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function()
        {
            i(this).attr("style", i(this).data("originalStyling"))
        }), t.$slideTrack.children(this.options.slide).detach(), t.$slideTrack.detach(), t.$list.detach(), t.$slider.append(t.$slides)),
        t.cleanUpRows(),
        t.$slider.removeClass("slick-slider"),
        t.$slider.removeClass("slick-initialized"),
        t.$slider.removeClass("slick-dotted"),
        t.unslicked = !0,
        e || t.$slider.trigger("destroy", [t])
    },
    e.prototype.disableTransition = function(i)
    {
        var e = this,
            t = {};
        t[e.transitionType] = "",
        !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t)
    },
    e.prototype.fadeSlide = function(i, e)
    {
        var t = this;
        !1 === t.cssTransitions ? (t.$slides.eq(i).css({zIndex: t.options.zIndex}), t.$slides.eq(i).animate({opacity: 1}, t.options.speed, t.options.easing, e)) : (t.applyTransition(i), t.$slides.eq(i).css({
            opacity: 1, zIndex: t.options.zIndex
        }), e && setTimeout(function()
            {
                t.disableTransition(i),
                e.call()
            }, t.options.speed))
    },
    e.prototype.fadeSlideOut = function(i)
    {
        var e = this;
        !1 === e.cssTransitions ? e.$slides.eq(i).animate({
            opacity: 0, zIndex: e.options.zIndex - 2
        }, e.options.speed, e.options.easing) : (e.applyTransition(i), e.$slides.eq(i).css({
            opacity: 0, zIndex: e.options.zIndex - 2
        }))
    },
    e.prototype.filterSlides = e.prototype.slickFilter = function(i)
    {
        var e = this;
        null !== i && (e.$slidesCache = e.$slides, e.unload(), e.$slideTrack.children(this.options.slide).detach(), e.$slidesCache.filter(i).appendTo(e.$slideTrack), e.reinit())
    },
    e.prototype.focusHandler = function()
    {
        var e = this;
        e.$slider.off("focus.slick blur.slick").on("focus.slick", "*", function(t)
        {
            var o = i(this);
            setTimeout(function()
            {
                e.options.pauseOnFocus && o.is(":focus") && (e.focussed = !0, e.autoPlay())
            }, 0)
        }).on("blur.slick", "*", function(t)
        {
            i(this),
            e.options.pauseOnFocus && (e.focussed = !1, e.autoPlay())
        })
    },
    e.prototype.getCurrent = e.prototype.slickCurrentSlide = function()
    {
        return this.currentSlide
    },
    e.prototype.getDotCount = function()
    {
        var i = this,
            e = 0,
            t = 0,
            o = 0;
        if (!0 === i.options.infinite)
            if (i.slideCount <= i.options.slidesToShow)
                ++o;
            else
                for (; e < i.slideCount; )
                    ++o,
                    e = t + i.options.slidesToScroll,
                    t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
        else if (!0 === i.options.centerMode)
            o = i.slideCount;
        else if (i.options.asNavFor)
            for (; e < i.slideCount; )
                ++o,
                e = t + i.options.slidesToScroll,
                t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
        else
            o = 1 + Math.ceil((i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll);
        return o - 1
    },
    e.prototype.getLeft = function(i)
    {
        var e,
            t,
            o,
            s,
            n = this,
            r = 0;
        return n.slideOffset = 0, t = n.$slides.first().outerHeight(!0), !0 === n.options.infinite ? (n.slideCount > n.options.slidesToShow && (n.slideOffset = n.slideWidth * n.options.slidesToShow * -1, s = -1, !0 === n.options.vertical && !0 === n.options.centerMode && (2 === n.options.slidesToShow ? s = -1.5 : 1 === n.options.slidesToShow && (s = -2)), r = t * n.options.slidesToShow * s), n.slideCount % n.options.slidesToScroll != 0 && i + n.options.slidesToScroll > n.slideCount && n.slideCount > n.options.slidesToShow && (i > n.slideCount ? (n.slideOffset = (n.options.slidesToShow - (i - n.slideCount)) * n.slideWidth * -1, r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1) : (n.slideOffset = n.slideCount % n.options.slidesToScroll * n.slideWidth * -1, r = n.slideCount % n.options.slidesToScroll * t * -1))) : i + n.options.slidesToShow > n.slideCount && (n.slideOffset = (i + n.options.slidesToShow - n.slideCount) * n.slideWidth, r = (i + n.options.slidesToShow - n.slideCount) * t), n.slideCount <= n.options.slidesToShow && (n.slideOffset = 0, r = 0), !0 === n.options.centerMode && n.slideCount <= n.options.slidesToShow ? n.slideOffset = n.slideWidth * Math.floor(n.options.slidesToShow) / 2 - n.slideWidth * n.slideCount / 2 : !0 === n.options.centerMode && !0 === n.options.infinite ? n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2) - n.slideWidth : !0 === n.options.centerMode && (n.slideOffset = 0, n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2)), e = !1 === n.options.vertical ? i * n.slideWidth * -1 + n.slideOffset : i * t * -1 + r, !0 === n.options.variableWidth && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow), e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, !0 === n.options.centerMode && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow + 1), e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, e += (n.$list.width() - o.outerWidth()) / 2)), e
    },
    e.prototype.getOption = e.prototype.slickGetOption = function(i)
    {
        return this.options[i]
    },
    e.prototype.getNavigableIndexes = function()
    {
        var i,
            e = this,
            t = 0,
            o = 0,
            s = [];
        for (!1 === e.options.infinite ? i = e.slideCount : (t = -1 * e.options.slidesToScroll, o = -1 * e.options.slidesToScroll, i = 2 * e.slideCount); t < i; )
            s.push(t),
            t = o + e.options.slidesToScroll,
            o += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        return s
    },
    e.prototype.getSlick = function()
    {
        return this
    },
    e.prototype.getSlideCount = function()
    {
        var e,
            t,
            o,
            s = this;
        return o = !0 === s.options.centerMode ? Math.floor(s.$list.width() / 2) : 0, t = -1 * s.swipeLeft + o, !0 === s.options.swipeToSlide ? (s.$slideTrack.find(".slick-slide").each(function(o, n)
                {
                    var r,
                        l;
                    if (r = i(n).outerWidth(), l = n.offsetLeft, !0 !== s.options.centerMode && (l += r / 2), t < l + r)
                        return e = n, !1
                }), Math.abs(i(e).attr("data-slick-index") - s.currentSlide) || 1) : s.options.slidesToScroll
    },
    e.prototype.goTo = e.prototype.slickGoTo = function(i, e)
    {
        this.changeSlide({data: {
                message: "index", index: parseInt(i)
            }}, e)
    },
    e.prototype.init = function(e)
    {
        var t = this;
        i(t.$slider).hasClass("slick-initialized") || (i(t.$slider).addClass("slick-initialized"), t.buildRows(), t.buildOut(), t.setProps(), t.startLoad(), t.loadSlider(), t.initializeEvents(), t.updateArrows(), t.updateDots(), t.checkResponsive(!0), t.focusHandler()),
        e && t.$slider.trigger("init", [t]),
        !0 === t.options.accessibility && t.initADA(),
        t.options.autoplay && (t.paused = !1, t.autoPlay())
    },
    e.prototype.initADA = function()
    {
        var e = this,
            t = Math.ceil(e.slideCount / e.options.slidesToShow),
            o = e.getNavigableIndexes().filter(function(i)
            {
                return i >= 0 && i < e.slideCount
            });
        e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
            "aria-hidden": "true", tabindex: "-1"
        }).find("a, input, button, select").attr({tabindex: "-1"}),
        null !== e.$dots && (e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t)
        {
            var s = o.indexOf(t);
            if (i(this).attr({
                role: "tabpanel", id: "slick-slide" + e.instanceUid + t, tabindex: -1
            }), -1 !== s)
            {
                var n = "slick-slide-control" + e.instanceUid + s;
                i("#" + n).length && i(this).attr({"aria-describedby": n})
            }
        }), e.$dots.attr("role", "tablist").find("li").each(function(s)
        {
            var n = o[s];
            i(this).attr({role: "presentation"}),
            i(this).find("button").first().attr({
                role: "tab", id: "slick-slide-control" + e.instanceUid + s, "aria-controls": "slick-slide" + e.instanceUid + n, "aria-label": s + 1 + " of " + t, "aria-selected": null, tabindex: "-1"
            })
        }).eq(e.currentSlide).find("button").attr({
            "aria-selected": "true", tabindex: "0"
        }).end());
        for (var s = e.currentSlide, n = s + e.options.slidesToShow; s < n; s++)
            e.options.focusOnChange ? e.$slides.eq(s).attr({tabindex: "0"}) : e.$slides.eq(s).removeAttr("tabindex");
        e.activateADA()
    },
    e.prototype.initArrowEvents = function()
    {
        var i = this;
        !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.off("click.slick").on("click.slick", {message: "previous"}, i.changeSlide), i.$nextArrow.off("click.slick").on("click.slick", {message: "next"}, i.changeSlide), !0 === i.options.accessibility && (i.$prevArrow.on("keydown.slick", i.keyHandler), i.$nextArrow.on("keydown.slick", i.keyHandler)))
    },
    e.prototype.initDotEvents = function()
    {
        var e = this;
        !0 === e.options.dots && e.slideCount > e.options.slidesToShow && (i("li", e.$dots).on("click.slick", {message: "index"}, e.changeSlide), !0 === e.options.accessibility && e.$dots.on("keydown.slick", e.keyHandler)),
        !0 === e.options.dots && !0 === e.options.pauseOnDotsHover && e.slideCount > e.options.slidesToShow && i("li", e.$dots).on("mouseenter.slick", i.proxy(e.interrupt, e, !0)).on("mouseleave.slick", i.proxy(e.interrupt, e, !1))
    },
    e.prototype.initSlideEvents = function()
    {
        var e = this;
        e.options.pauseOnHover && (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)), e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)))
    },
    e.prototype.initializeEvents = function()
    {
        var e = this;
        e.initArrowEvents(),
        e.initDotEvents(),
        e.initSlideEvents(),
        e.$list.on("touchstart.slick mousedown.slick", {action: "start"}, e.swipeHandler),
        e.$list.on("touchmove.slick mousemove.slick", {action: "move"}, e.swipeHandler),
        e.$list.on("touchend.slick mouseup.slick", {action: "end"}, e.swipeHandler),
        e.$list.on("touchcancel.slick mouseleave.slick", {action: "end"}, e.swipeHandler),
        e.$list.on("click.slick", e.clickHandler),
        i(document).on(e.visibilityChange, i.proxy(e.visibility, e)),
        !0 === e.options.accessibility && e.$list.on("keydown.slick", e.keyHandler),
        !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler),
        i(window).on("orientationchange.slick.slick-" + e.instanceUid, i.proxy(e.orientationChange, e)),
        i(window).on("resize.slick.slick-" + e.instanceUid, i.proxy(e.resize, e)),
        i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault),
        i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition),
        i(e.setPosition)
    },
    e.prototype.initUI = function()
    {
        var i = this;
        !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.show(), i.$nextArrow.show()),
        !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.show()
    },
    e.prototype.keyHandler = function(i)
    {
        var e = this;
        i.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === i.keyCode && !0 === e.options.accessibility ? e.changeSlide({data: {message: !0 === e.options.rtl ? "next" : "previous"}}) : 39 === i.keyCode && !0 === e.options.accessibility && e.changeSlide({data: {message: !0 === e.options.rtl ? "previous" : "next"}}))
    },
    e.prototype.lazyLoad = function()
    {
        function e(e)
        {
            i("img[data-lazy]", e).each(function()
            {
                var e = i(this),
                    t = i(this).attr("data-lazy"),
                    o = i(this).attr("data-srcset"),
                    s = i(this).attr("data-sizes") || n.$slider.attr("data-sizes"),
                    r = document.createElement("img");
                r.onload = function()
                {
                    e.animate({opacity: 0}, 100, function()
                    {
                        o && (e.attr("srcset", o), s && e.attr("sizes", s)),
                        e.attr("src", t).animate({opacity: 1}, 200, function()
                        {
                            e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                        }),
                        n.$slider.trigger("lazyLoaded", [n, e, t])
                    })
                },
                r.onerror = function()
                {
                    e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
                    n.$slider.trigger("lazyLoadError", [n, e, t])
                },
                r.src = t
            })
        }
        var t,
            o,
            s,
            n = this;
        if (!0 === n.options.centerMode ? !0 === n.options.infinite ? s = (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) + n.options.slidesToShow + 2 : (o = Math.max(0, n.currentSlide - (n.options.slidesToShow / 2 + 1)), s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide) : (o = n.options.infinite ? n.options.slidesToShow + n.currentSlide : n.currentSlide, s = Math.ceil(o + n.options.slidesToShow), !0 === n.options.fade && (o > 0 && o--, s <= n.slideCount && s++)), t = n.$slider.find(".slick-slide").slice(o, s), "anticipated" === n.options.lazyLoad)
            for (var r = o - 1, l = s, d = n.$slider.find(".slick-slide"), a = 0; a < n.options.slidesToScroll; a++)
                r < 0 && (r = n.slideCount - 1),
                t = (t = t.add(d.eq(r))).add(d.eq(l)),
                r--,
                l++;
        e(t),
        n.slideCount <= n.options.slidesToShow ? e(n.$slider.find(".slick-slide")) : n.currentSlide >= n.slideCount - n.options.slidesToShow ? e(n.$slider.find(".slick-cloned").slice(0, n.options.slidesToShow)) : 0 === n.currentSlide && e(n.$slider.find(".slick-cloned").slice(-1 * n.options.slidesToShow))
    },
    e.prototype.loadSlider = function()
    {
        var i = this;
        i.setPosition(),
        i.$slideTrack.css({opacity: 1}),
        i.$slider.removeClass("slick-loading"),
        i.initUI(),
        "progressive" === i.options.lazyLoad && i.progressiveLazyLoad()
    },
    e.prototype.next = e.prototype.slickNext = function()
    {
        this.changeSlide({data: {message: "next"}})
    },
    e.prototype.orientationChange = function()
    {
        this.checkResponsive(),
        this.setPosition()
    },
    e.prototype.pause = e.prototype.slickPause = function()
    {
        this.autoPlayClear(),
        this.paused = !0
    },
    e.prototype.play = e.prototype.slickPlay = function()
    {
        var i = this;
        i.autoPlay(),
        i.options.autoplay = !0,
        i.paused = !1,
        i.focussed = !1,
        i.interrupted = !1
    },
    e.prototype.postSlide = function(e)
    {
        var t = this;
        !t.unslicked && (t.$slider.trigger("afterChange", [t, e]), t.animating = !1, t.slideCount > t.options.slidesToShow && t.setPosition(), t.swipeLeft = null, t.options.autoplay && t.autoPlay(), !0 === t.options.accessibility && (t.initADA(), t.options.focusOnChange)) && i(t.$slides.get(t.currentSlide)).attr("tabindex", 0).focus()
    },
    e.prototype.prev = e.prototype.slickPrev = function()
    {
        this.changeSlide({data: {message: "previous"}})
    },
    e.prototype.preventDefault = function(i)
    {
        i.preventDefault()
    },
    e.prototype.progressiveLazyLoad = function(e)
    {
        e = e || 1;
        var t,
            o,
            s,
            n,
            r,
            l = this,
            d = i("img[data-lazy]", l.$slider);
        d.length ? (t = d.first(), o = t.attr("data-lazy"), s = t.attr("data-srcset"), n = t.attr("data-sizes") || l.$slider.attr("data-sizes"), (r = document.createElement("img")).onload = function()
            {
                s && (t.attr("srcset", s), n && t.attr("sizes", n)),
                t.attr("src", o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),
                !0 === l.options.adaptiveHeight && l.setPosition(),
                l.$slider.trigger("lazyLoaded", [l, t, o]),
                l.progressiveLazyLoad()
            }, r.onerror = function()
            {
                e < 3 ? setTimeout(function()
                {
                    l.progressiveLazyLoad(e + 1)
                }, 500) : (t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), l.$slider.trigger("lazyLoadError", [l, t, o]), l.progressiveLazyLoad())
            }, r.src = o) : l.$slider.trigger("allImagesLoaded", [l])
    },
    e.prototype.refresh = function(e)
    {
        var t,
            o,
            s = this;
        o = s.slideCount - s.options.slidesToShow,
        !s.options.infinite && s.currentSlide > o && (s.currentSlide = o),
        s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0),
        t = s.currentSlide,
        s.destroy(!0),
        i.extend(s, s.initials, {currentSlide: t}),
        s.init(),
        e || s.changeSlide({data: {
                message: "index", index: t
            }}, !1)
    },
    e.prototype.registerBreakpoints = function()
    {
        var e,
            t,
            o,
            s = this,
            n = s.options.responsive || null;
        if ("array" === i.type(n) && n.length)
        {
            for (e in s.respondTo = s.options.respondTo || "window", n)
                if (o = s.breakpoints.length - 1, n.hasOwnProperty(e))
                {
                    for (t = n[e].breakpoint; o >= 0; )
                        s.breakpoints[o] && s.breakpoints[o] === t && s.breakpoints.splice(o, 1),
                        o--;
                    s.breakpoints.push(t),
                    s.breakpointSettings[t] = n[e].settings
                }
            s.breakpoints.sort(function(i, e)
            {
                return s.options.mobileFirst ? i - e : e - i
            })
        }
    },
    e.prototype.reinit = function()
    {
        var e = this;
        e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"),
        e.slideCount = e.$slides.length,
        e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll),
        e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0),
        e.registerBreakpoints(),
        e.setProps(),
        e.setupInfinite(),
        e.buildArrows(),
        e.updateArrows(),
        e.initArrowEvents(),
        e.buildDots(),
        e.updateDots(),
        e.initDotEvents(),
        e.cleanUpSlideEvents(),
        e.initSlideEvents(),
        e.checkResponsive(!1, !0),
        !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler),
        e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0),
        e.setPosition(),
        e.focusHandler(),
        e.paused = !e.options.autoplay,
        e.autoPlay(),
        e.$slider.trigger("reInit", [e])
    },
    e.prototype.resize = function()
    {
        var e = this;
        i(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay), e.windowDelay = window.setTimeout(function()
        {
            e.windowWidth = i(window).width(),
            e.checkResponsive(),
            e.unslicked || e.setPosition()
        }, 50))
    },
    e.prototype.removeSlide = e.prototype.slickRemove = function(i, e, t)
    {
        var o = this;
        return "boolean" == typeof i ? i = !0 === (e = i) ? 0 : o.slideCount - 1 : i = !0 === e ? --i : i, !(o.slideCount < 1 || i < 0 || i > o.slideCount - 1) && (o.unload(), !0 === t ? o.$slideTrack.children().remove() : o.$slideTrack.children(this.options.slide).eq(i).remove(), o.$slides = o.$slideTrack.children(this.options.slide), o.$slideTrack.children(this.options.slide).detach(), o.$slideTrack.append(o.$slides), o.$slidesCache = o.$slides, void o.reinit())
    },
    e.prototype.setCSS = function(i)
    {
        var e,
            t,
            o = this,
            s = {};
        !0 === o.options.rtl && (i = -i),
        e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px",
        t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px",
        s[o.positionProp] = i,
        !1 === o.transformsEnabled ? o.$slideTrack.css(s) : (s = {}, !1 === o.cssTransitions ? (s[o.animType] = "translate(" + e + ", " + t + ")", o.$slideTrack.css(s)) : (s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)", o.$slideTrack.css(s)))
    },
    e.prototype.setDimensions = function()
    {
        var i = this;
        !1 === i.options.vertical ? !0 === i.options.centerMode && i.$list.css({padding: "0px " + i.options.centerPadding}) : (i.$list.height(i.$slides.first().outerHeight(!0) * i.options.slidesToShow), !0 === i.options.centerMode && i.$list.css({padding: i.options.centerPadding + " 0px"})),
        i.listWidth = i.$list.width(),
        i.listHeight = i.$list.height(),
        !1 === i.options.vertical && !1 === i.options.variableWidth ? (i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow), i.$slideTrack.width(Math.ceil(i.slideWidth * i.$slideTrack.children(".slick-slide").length))) : !0 === i.options.variableWidth ? i.$slideTrack.width(5e3 * i.slideCount) : (i.slideWidth = Math.ceil(i.listWidth), i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0) * i.$slideTrack.children(".slick-slide").length)));
        var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
        !1 === i.options.variableWidth && i.$slideTrack.children(".slick-slide").width(i.slideWidth - e)
    },
    e.prototype.setFade = function()
    {
        var e,
            t = this;
        t.$slides.each(function(o, s)
        {
            e = t.slideWidth * o * -1,
            !0 === t.options.rtl ? i(s).css({
                position: "relative", right: e, top: 0, zIndex: t.options.zIndex - 2, opacity: 0
            }) : i(s).css({
                position: "relative", left: e, top: 0, zIndex: t.options.zIndex - 2, opacity: 0
            })
        }),
        t.$slides.eq(t.currentSlide).css({
            zIndex: t.options.zIndex - 1, opacity: 1
        })
    },
    e.prototype.setHeight = function()
    {
        var i = this;
        if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical)
        {
            var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
            i.$list.css("height", e)
        }
    },
    e.prototype.setOption = e.prototype.slickSetOption = function()
    {
        var e,
            t,
            o,
            s,
            n,
            r = this,
            l = !1;
        if ("object" === i.type(arguments[0]) ? (o = arguments[0], l = arguments[1], n = "multiple") : "string" === i.type(arguments[0]) && (o = arguments[0], s = arguments[1], l = arguments[2], "responsive" === arguments[0] && "array" === i.type(arguments[1]) ? n = "responsive" : void 0 !== arguments[1] && (n = "single")), "single" === n)
            r.options[o] = s;
        else if ("multiple" === n)
            i.each(o, function(i, e)
            {
                r.options[i] = e
            });
        else if ("responsive" === n)
            for (t in s)
                if ("array" !== i.type(r.options.responsive))
                    r.options.responsive = [s[t]];
                else
                {
                    for (e = r.options.responsive.length - 1; e >= 0; )
                        r.options.responsive[e].breakpoint === s[t].breakpoint && r.options.responsive.splice(e, 1),
                        e--;
                    r.options.responsive.push(s[t])
                }
        l && (r.unload(), r.reinit())
    },
    e.prototype.setPosition = function()
    {
        var i = this;
        i.setDimensions(),
        i.setHeight(),
        !1 === i.options.fade ? i.setCSS(i.getLeft(i.currentSlide)) : i.setFade(),
        i.$slider.trigger("setPosition", [i])
    },
    e.prototype.setProps = function()
    {
        var i = this,
            e = document.body.style;
        i.positionProp = !0 === i.options.vertical ? "top" : "left",
        "top" === i.positionProp ? i.$slider.addClass("slick-vertical") : i.$slider.removeClass("slick-vertical"),
        void 0 === e.WebkitTransition && void 0 === e.MozTransition && void 0 === e.msTransition || !0 === i.options.useCSS && (i.cssTransitions = !0),
        i.options.fade && ("number" == typeof i.options.zIndex ? i.options.zIndex < 3 && (i.options.zIndex = 3) : i.options.zIndex = i.defaults.zIndex),
        void 0 !== e.OTransform && (i.animType = "OTransform", i.transformType = "-o-transform", i.transitionType = "OTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)),
        void 0 !== e.MozTransform && (i.animType = "MozTransform", i.transformType = "-moz-transform", i.transitionType = "MozTransition", void 0 === e.perspectiveProperty && void 0 === e.MozPerspective && (i.animType = !1)),
        void 0 !== e.webkitTransform && (i.animType = "webkitTransform", i.transformType = "-webkit-transform", i.transitionType = "webkitTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)),
        void 0 !== e.msTransform && (i.animType = "msTransform", i.transformType = "-ms-transform", i.transitionType = "msTransition", void 0 === e.msTransform && (i.animType = !1)),
        void 0 !== e.transform && !1 !== i.animType && (i.animType = "transform", i.transformType = "transform", i.transitionType = "transition"),
        i.transformsEnabled = i.options.useTransform && null !== i.animType && !1 !== i.animType
    },
    e.prototype.setSlideClasses = function(i)
    {
        var e,
            t,
            o,
            s,
            n = this;
        if (t = n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), n.$slides.eq(i).addClass("slick-current"), !0 === n.options.centerMode)
        {
            var r = n.options.slidesToShow % 2 == 0 ? 1 : 0;
            e = Math.floor(n.options.slidesToShow / 2),
            !0 === n.options.infinite && (i >= e && i <= n.slideCount - 1 - e ? n.$slides.slice(i - e + r, i + e + 1).addClass("slick-active").attr("aria-hidden", "false") : (o = n.options.slidesToShow + i, t.slice(o - e + 1 + r, o + e + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === i ? t.eq(t.length - 1 - n.options.slidesToShow).addClass("slick-center") : i === n.slideCount - 1 && t.eq(n.options.slidesToShow).addClass("slick-center")),
            n.$slides.eq(i).addClass("slick-center")
        }
        else
            i >= 0 && i <= n.slideCount - n.options.slidesToShow ? n.$slides.slice(i, i + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : t.length <= n.options.slidesToShow ? t.addClass("slick-active").attr("aria-hidden", "false") : (s = n.slideCount % n.options.slidesToShow, o = !0 === n.options.infinite ? n.options.slidesToShow + i : i, n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - i < n.options.slidesToShow ? t.slice(o - (n.options.slidesToShow - s), o + s).addClass("slick-active").attr("aria-hidden", "false") : t.slice(o, o + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
        "ondemand" !== n.options.lazyLoad && "anticipated" !== n.options.lazyLoad || n.lazyLoad()
    },
    e.prototype.setupInfinite = function()
    {
        var e,
            t,
            o,
            s = this;
        if (!0 === s.options.fade && (s.options.centerMode = !1), !0 === s.options.infinite && !1 === s.options.fade && (t = null, s.slideCount > s.options.slidesToShow))
        {
            for (o = !0 === s.options.centerMode ? s.options.slidesToShow + 1 : s.options.slidesToShow, e = s.slideCount; e > s.slideCount - o; e -= 1)
                t = e - 1,
                i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t - s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");
            for (e = 0; e < o + s.slideCount; e += 1)
                t = e,
                i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t + s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");
            s.$slideTrack.find(".slick-cloned").find("[id]").each(function()
            {
                i(this).attr("id", "")
            })
        }
    },
    e.prototype.interrupt = function(i)
    {
        i || this.autoPlay(),
        this.interrupted = i
    },
    e.prototype.selectHandler = function(e)
    {
        var t = this,
            o = i(e.target).is(".slick-slide") ? i(e.target) : i(e.target).parents(".slick-slide"),
            s = parseInt(o.attr("data-slick-index"));
        return s || (s = 0), t.slideCount <= t.options.slidesToShow ? void t.slideHandler(s, !1, !0) : void t.slideHandler(s)
    },
    e.prototype.slideHandler = function(i, e, t)
    {
        var o,
            s,
            n,
            r,
            l,
            d = null,
            a = this;
        if (e = e || !1, !(!0 === a.animating && !0 === a.options.waitForAnimate || !0 === a.options.fade && a.currentSlide === i))
            return !1 === e && a.asNavFor(i), o = i, d = a.getLeft(o), r = a.getLeft(a.currentSlide), a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft, !1 === a.options.infinite && !1 === a.options.centerMode && (i < 0 || i > a.getDotCount() * a.options.slidesToScroll) ? void(!1 === a.options.fade && (o = a.currentSlide, !0 !== t && a.slideCount > a.options.slidesToShow ? a.animateSlide(r, function()
                    {
                        a.postSlide(o)
                    }) : a.postSlide(o))) : !1 === a.options.infinite && !0 === a.options.centerMode && (i < 0 || i > a.slideCount - a.options.slidesToScroll) ? void(!1 === a.options.fade && (o = a.currentSlide, !0 !== t && a.slideCount > a.options.slidesToShow ? a.animateSlide(r, function()
                    {
                        a.postSlide(o)
                    }) : a.postSlide(o))) : (a.options.autoplay && clearInterval(a.autoPlayTimer), s = o < 0 ? a.slideCount % a.options.slidesToScroll != 0 ? a.slideCount - a.slideCount % a.options.slidesToScroll : a.slideCount + o : o >= a.slideCount ? a.slideCount % a.options.slidesToScroll != 0 ? 0 : o - a.slideCount : o, a.animating = !0, a.$slider.trigger("beforeChange", [a, a.currentSlide, s]), n = a.currentSlide, a.currentSlide = s, a.setSlideClasses(a.currentSlide), a.options.asNavFor && ((l = (l = a.getNavTarget()).slick("getSlick")).slideCount <= l.options.slidesToShow && l.setSlideClasses(a.currentSlide)), a.updateDots(), a.updateArrows(), !0 === a.options.fade ? (!0 !== t ? (a.fadeSlideOut(n), a.fadeSlide(s, function()
                        {
                            a.postSlide(s)
                        })) : a.postSlide(s), void a.animateHeight()) : void(!0 !== t && a.slideCount > a.options.slidesToShow ? a.animateSlide(d, function()
                        {
                            a.postSlide(s)
                        }) : a.postSlide(s)))
    },
    e.prototype.startLoad = function()
    {
        var i = this;
        !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.hide(), i.$nextArrow.hide()),
        !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.hide(),
        i.$slider.addClass("slick-loading")
    },
    e.prototype.swipeDirection = function()
    {
        var i,
            e,
            t,
            o,
            s = this;
        return i = s.touchObject.startX - s.touchObject.curX, e = s.touchObject.startY - s.touchObject.curY, t = Math.atan2(e, i), (o = Math.round(180 * t / Math.PI)) < 0 && (o = 360 - Math.abs(o)), o <= 45 && o >= 0 ? !1 === s.options.rtl ? "left" : "right" : o <= 360 && o >= 315 ? !1 === s.options.rtl ? "left" : "right" : o >= 135 && o <= 225 ? !1 === s.options.rtl ? "right" : "left" : !0 === s.options.verticalSwiping ? o >= 35 && o <= 135 ? "down" : "up" : "vertical"
    },
    e.prototype.swipeEnd = function(i)
    {
        var e,
            t,
            o = this;
        if (o.dragging = !1, o.swiping = !1, o.scrolling)
            return o.scrolling = !1, !1;
        if (o.interrupted = !1, o.shouldClick = !(o.touchObject.swipeLength > 10), void 0 === o.touchObject.curX)
            return !1;
        if (!0 === o.touchObject.edgeHit && o.$slider.trigger("edge", [o, o.swipeDirection()]), o.touchObject.swipeLength >= o.touchObject.minSwipe)
        {
            switch (t = o.swipeDirection())
            {
                case"left":
                case"down":
                    e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount(),
                    o.currentDirection = 0;
                    break;
                case"right":
                case"up":
                    e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount(),
                    o.currentDirection = 1
            }
            "vertical" != t && (o.slideHandler(e), o.touchObject = {}, o.$slider.trigger("swipe", [o, t]))
        }
        else
            o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide), o.touchObject = {})
    },
    e.prototype.swipeHandler = function(i)
    {
        var e = this;
        if (!(!1 === e.options.swipe || "ontouchend" in document && !1 === e.options.swipe || !1 === e.options.draggable && -1 !== i.type.indexOf("mouse")))
            switch (e.touchObject.fingerCount = i.originalEvent && void 0 !== i.originalEvent.touches ? i.originalEvent.touches.length : 1, e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold, !0 === e.options.verticalSwiping && (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold), i.data.action)
            {
                case"start":
                    e.swipeStart(i);
                    break;
                case"move":
                    e.swipeMove(i);
                    break;
                case"end":
                    e.swipeEnd(i)
            }
    },
    e.prototype.swipeMove = function(i)
    {
        var e,
            t,
            o,
            s,
            n,
            r,
            l = this;
        return n = void 0 !== i.originalEvent ? i.originalEvent.touches : null, !(!l.dragging || l.scrolling || n && 1 !== n.length) && (e = l.getLeft(l.currentSlide), l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX, l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY, l.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))), r = Math.round(Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))), !l.options.verticalSwiping && !l.swiping && r > 4 ? (l.scrolling = !0, !1) : (!0 === l.options.verticalSwiping && (l.touchObject.swipeLength = r), t = l.swipeDirection(), void 0 !== i.originalEvent && l.touchObject.swipeLength > 4 && (l.swiping = !0, i.preventDefault()), s = (!1 === l.options.rtl ? 1 : -1) * (l.touchObject.curX > l.touchObject.startX ? 1 : -1), !0 === l.options.verticalSwiping && (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1), o = l.touchObject.swipeLength, l.touchObject.edgeHit = !1, !1 === l.options.infinite && (0 === l.currentSlide && "right" === t || l.currentSlide >= l.getDotCount() && "left" === t) && (o = l.touchObject.swipeLength * l.options.edgeFriction, l.touchObject.edgeHit = !0), !1 === l.options.vertical ? l.swipeLeft = e + o * s : l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s, !0 === l.options.verticalSwiping && (l.swipeLeft = e + o * s), !0 !== l.options.fade && !1 !== l.options.touchMove && (!0 === l.animating ? (l.swipeLeft = null, !1) : void l.setCSS(l.swipeLeft))))
    },
    e.prototype.swipeStart = function(i)
    {
        var e,
            t = this;
        return t.interrupted = !0, 1 !== t.touchObject.fingerCount || t.slideCount <= t.options.slidesToShow ? (t.touchObject = {}, !1) : (void 0 !== i.originalEvent && void 0 !== i.originalEvent.touches && (e = i.originalEvent.touches[0]), t.touchObject.startX = t.touchObject.curX = void 0 !== e ? e.pageX : i.clientX, t.touchObject.startY = t.touchObject.curY = void 0 !== e ? e.pageY : i.clientY, void(t.dragging = !0))
    },
    e.prototype.unfilterSlides = e.prototype.slickUnfilter = function()
    {
        var i = this;
        null !== i.$slidesCache && (i.unload(), i.$slideTrack.children(this.options.slide).detach(), i.$slidesCache.appendTo(i.$slideTrack), i.reinit())
    },
    e.prototype.unload = function()
    {
        var e = this;
        i(".slick-cloned", e.$slider).remove(),
        e.$dots && e.$dots.remove(),
        e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(),
        e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(),
        e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
    },
    e.prototype.unslick = function(i)
    {
        var e = this;
        e.$slider.trigger("unslick", [e, i]),
        e.destroy()
    },
    e.prototype.updateArrows = function()
    {
        var i = this;
        Math.floor(i.options.slidesToShow / 2),
        !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && !i.options.infinite && (i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === i.currentSlide ? (i.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - i.options.slidesToShow && !1 === i.options.centerMode ? (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - 1 && !0 === i.options.centerMode && (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
    },
    e.prototype.updateDots = function()
    {
        var i = this;
        null !== i.$dots && (i.$dots.find("li").removeClass("slick-active").end(), i.$dots.find("li").eq(Math.floor(i.currentSlide / i.options.slidesToScroll)).addClass("slick-active"))
    },
    e.prototype.visibility = function()
    {
        var i = this;
        i.options.autoplay && (document[i.hidden] ? i.interrupted = !0 : i.interrupted = !1)
    },
    i.fn.slick = function()
    {
        var i,
            t,
            o = this,
            s = arguments[0],
            n = Array.prototype.slice.call(arguments, 1),
            r = o.length;
        for (i = 0; i < r; i++)
            if ("object" == typeof s || void 0 === s ? o[i].slick = new e(o[i], s) : t = o[i].slick[s].apply(o[i].slick, n), void 0 !== t)
                return t;
        return o
    }
});
function initAnchors()
{
    new SmoothScroll({
        anchorLinks: ".ci-back-to-top", extraOffset: 0, wheelBehavior: "none"
    })
}
jQuery(function()
{
    initAnchors()
}),
function(t, o)
{
    var n,
        i,
        e,
        s = t(window),
        r = "onwheel" in document || document.documentMode >= 9 ? "wheel" : "mousewheel DOMMouseScroll";
    function a(o, s, a)
    {
        var c;
        document.body && (s = "number" == typeof s ? {duration: s} : s || {}, n = n || t("html, body"), c = s.container || n, "number" == typeof o && (o = {top: o}), i && e && i.off(r, e), s.wheelBehavior && "none" !== s.wheelBehavior && (e = function(t)
            {
                "stop" === s.wheelBehavior ? (c.off(r, e), c.stop()) : "ignore" === s.wheelBehavior && t.preventDefault()
            }, i = c.on(r, e)), c.stop().animate({
                scrollLeft: o.left, scrollTop: o.top
            }, s.duration, function()
            {
                e && c.off(r, e),
                t.isFunction(a) && a()
            }))
    }
    function c(o)
    {
        this.options = t.extend({
            anchorLinks: 'a[href^="#"]', container: null, extraOffset: null, activeClasses: null, easing: "swing", animMode: "duration", animDuration: 800, animSpeed: 1500, anchorActiveClass: "anchor-active", sectionActiveClass: "section-active", wheelBehavior: "stop", useNativeAnchorScrolling: !1
        }, o),
        this.init()
    }
    c.prototype = {
        init: function()
        {
            this.initStructure(),
            this.attachEvents(),
            this.isInit = !0
        }, initStructure: function()
            {
                var o = this;
                this.container = this.options.container ? t(this.options.container) : t("html,body"),
                this.scrollContainer = this.options.container ? this.container : s,
                this.anchorLinks = jQuery(this.options.anchorLinks).filter(function()
                {
                    return jQuery(o.getAnchorTarget(jQuery(this))).length
                })
            }, getId: function(t)
            {
                try
                {
                    return "#" + t.replace(/^.*?(#|$)/, "")
                }
                catch(t)
                {
                    return null
                }
            }, getAnchorTarget: function(o)
            {
                var n = this.getId(t(o).attr("href"));
                return t(n.length > 1 ? n : "html")
            }, getTargetOffset: function(t)
            {
                var o = t.offset().top;
                return this.options.container && (o -= this.container.offset().top - this.container.prop("scrollTop")), "number" == typeof this.options.extraOffset ? o -= this.options.extraOffset : "function" == typeof this.options.extraOffset && (o -= this.options.extraOffset(t)), {top: o}
            }, attachEvents: function()
            {
                var o = this;
                if (this.options.activeClasses && this.anchorLinks.length)
                {
                    this.anchorData = [];
                    for (var n = 0; n < this.anchorLinks.length; n++)
                    {
                        var i = jQuery(this.anchorLinks[n]),
                            e = o.getAnchorTarget(i),
                            r = null;
                        t.each(o.anchorData, function(t, o)
                        {
                            o.block[0] === e[0] && (r = o)
                        }),
                        r ? r.link = r.link.add(i) : o.anchorData.push({
                            link: i, block: e
                        })
                    }
                    this.resizeHandler = function()
                    {
                        o.isInit && o.recalculateOffsets()
                    },
                    this.scrollHandler = function()
                    {
                        o.refreshActiveClass()
                    },
                    this.recalculateOffsets(),
                    this.scrollContainer.on("scroll", this.scrollHandler),
                    s.on("resize load orientationchange refreshAnchor", this.resizeHandler)
                }
                this.clickHandler = function(t)
                {
                    o.onClick(t)
                },
                this.options.useNativeAnchorScrolling || this.anchorLinks.on("click", this.clickHandler)
            }, recalculateOffsets: function()
            {
                var o = this;
                t.each(this.anchorData, function(t, n)
                {
                    n.offset = o.getTargetOffset(n.block),
                    n.height = n.block.outerHeight()
                }),
                this.refreshActiveClass()
            }, toggleActiveClass: function(t, o, n)
            {
                t.toggleClass(this.options.anchorActiveClass, n),
                o.toggleClass(this.options.sectionActiveClass, n)
            }, refreshActiveClass: function()
            {
                var o = this,
                    n = !1,
                    i = this.container.prop("scrollHeight"),
                    e = this.scrollContainer.height(),
                    r = this.options.container ? this.container.prop("scrollTop") : s.scrollTop();
                this.options.customScrollHandler ? this.options.customScrollHandler.call(this, r, this.anchorData) : (this.anchorData.sort(function(t, o)
                {
                    return t.offset.top - o.offset.top
                }), t.each(this.anchorData, function(t)
                {
                    var s = o.anchorData.length - t - 1,
                        a = o.anchorData[s],
                        c = "parent" === o.options.activeClasses ? a.link.parent() : a.link;
                    r >= i - e ? s === o.anchorData.length - 1 ? o.toggleActiveClass(c, a.block, !0) : o.toggleActiveClass(c, a.block, !1) : !n && (r >= a.offset.top - 1 || 0 === s) ? (n = !0, o.toggleActiveClass(c, a.block, !0)) : o.toggleActiveClass(c, a.block, !1)
                }))
            }, calculateScrollDuration: function(t)
            {
                return "speed" === this.options.animMode ? Math.abs(this.scrollContainer.scrollTop() - t.top) / this.options.animSpeed * 1e3 : this.options.animDuration
            }, onClick: function(t)
            {
                var o = this.getAnchorTarget(t.currentTarget),
                    n = this.getTargetOffset(o);
                t.preventDefault(),
                a(n, {
                    container: this.container, wheelBehavior: this.options.wheelBehavior, duration: this.calculateScrollDuration(n)
                }),
                this.makeCallback("onBeforeScroll", t.currentTarget)
            }, makeCallback: function(t)
            {
                if ("function" == typeof this.options[t])
                {
                    var o = Array.prototype.slice.call(arguments);
                    o.shift(),
                    this.options[t].apply(this, o)
                }
            }, destroy: function()
            {
                var o = this;
                this.isInit = !1,
                this.options.activeClasses && (s.off("resize load orientationchange refreshAnchor", this.resizeHandler), this.scrollContainer.off("scroll", this.scrollHandler), t.each(this.anchorData, function(t)
                    {
                        var n = o.anchorData.length - t - 1,
                            i = o.anchorData[n],
                            e = "parent" === o.options.activeClasses ? i.link.parent() : i.link;
                        o.toggleActiveClass(e, i.block, !1)
                    })),
                this.anchorLinks.off("click", this.clickHandler)
            }
    },
    t.extend(c, {scrollTo: function(t, o, n)
        {
            a(t, o, n)
        }}),
    o.SmoothScroll = c
}(jQuery, this);
function initInViewport()
{
    jQuery(".anim-set").itemInViewport({visibleMode: 3})
}
jQuery(function()
{
    initInViewport()
}),
function(e, t)
{
    "use strict";
    var o,
        i = (o = {}, {
            init: function()
            {
                var i = this;
                this.addHolder("win", t),
                t.on("load.blockInViewport resize.blockInViewport orientationchange.blockInViewport", function()
                {
                    e.each(o, function(t, o)
                    {
                        i.calcHolderSize(o),
                        e.each(o.items, function(e, t)
                        {
                            i.calcItemSize(e, t)
                        })
                    })
                })
            }, addHolder: function(t, i)
                {
                    var l = this,
                        s = {
                            holder: i, items: {}, props: {
                                    height: 0, scroll: 0
                                }
                        };
                    o[t] = s,
                    i.on("scroll.blockInViewport", function()
                    {
                        l.calcHolderScroll(s),
                        e.each(s.items, function(e, t)
                        {
                            l.calcItemScroll(e, t)
                        })
                    }),
                    this.calcHolderSize(o[t])
                }, calcHolderSize: function(e)
                {
                    var t = window.self !== e.holder[0] ? e.holder.offset() : 0;
                    e.props.height = e.holder.get(0) === window ? window.innerHeight || document.documentElement.clientHeight : e.holder.outerHeight(),
                    e.props.offset = t ? t.top : 0,
                    this.calcHolderScroll(e)
                }, calcItemSize: function(e, t)
                {
                    t.offset = t.$el.offset().top - t.holderProps.props.offset,
                    t.height = t.$el.outerHeight(),
                    this.calcItemScroll(e, t)
                }, calcHolderScroll: function(e)
                {
                    e.props.scroll = e.holder.scrollTop()
                }, calcItemScroll: function(t, o)
                {
                    var i,
                        l,
                        s,
                        r = o.holderProps.props;
                    switch (o.options.visibleMode)
                    {
                        case 1:
                            l = o.offset < r.scroll + r.height / 2 || o.offset + o.height < r.scroll + r.height,
                            i = o.offset > r.scroll || o.offset + o.height > r.scroll + r.height / 2;
                            break;
                        case 2:
                            l = l || o.offset < r.scroll + r.height / 2 || o.offset + o.height / 2 < r.scroll + r.height,
                            i = i || o.offset + o.height / 2 > r.scroll || o.offset + o.height > r.scroll + r.height / 2;
                            break;
                        case 3:
                            l = l || o.offset < r.scroll + r.height / 2 || o.offset < r.scroll + r.height,
                            i = i || o.offset + o.height > r.scroll || o.offset + o.height > r.scroll + r.height / 2;
                            break;
                        default:
                            l = l || o.offset < r.scroll + r.height / 2 || o.offset + Math.min(o.options.visibleMode, o.height) < r.scroll + r.height,
                            i = i || o.offset + o.height - Math.min(o.options.visibleMode, o.height) > r.scroll || o.offset + o.height > r.scroll + r.height / 2
                    }
                    i && l ? o.state || (o.state = !0, o.$el.addClass(o.options.activeClass).trigger("in-viewport", !0), (o.options.once || e.isFunction(o.options.onShow) && o.options.onShow(o)) && delete o.holderProps.items[t]) : (s = o.offset < r.scroll + r.height && o.offset + o.height > r.scroll, !o.state && !isNaN(o.state) || s || (o.state = !1, o.$el.removeClass(o.options.activeClass).trigger("in-viewport", !1)))
                }, addItem: function(t, i)
                {
                    var l = "item" + this.getRandomValue(),
                        s = {
                            $el: e(t), options: i
                        },
                        r = s.$el.closest(i.holder),
                        n = r.data("in-viewport-holder");
                    r.length ? n || (n = "holder" + this.getRandomValue(), r.data("in-viewport-holder", n), this.addHolder(n, r)) : n = "win",
                    s.holderProps = o[n],
                    o[n].items[l] = s,
                    this.calcItemSize(l, s)
                }, getRandomValue: function()
                {
                    return (1e5 * Math.random()).toFixed(0)
                }, destroy: function()
                {
                    t.off(".blockInViewport"),
                    e.each(o, function(t, o)
                    {
                        o.holder.off(".blockInViewport"),
                        e.each(o.items, function(e, t)
                        {
                            t.$el.removeClass(t.options.activeClass),
                            t.$el.get(0).itemInViewportAdded = null
                        })
                    }),
                    o = {}
                }
        });
    i.init(),
    e.fn.itemInViewport = function(t)
    {
        return t = e.extend({
                activeClass: "in-viewport", once: !0, holder: "", visibleMode: 1
            }, t), this.each(function()
            {
                this.itemInViewportAdded || (this.itemInViewportAdded = !0, i.addItem(this, t))
            })
    }
}(jQuery, jQuery(window));
function initStickyScrollBlock()
{
    jQuery(".ci-header-main").stickyScrollBlock({
        setBoxHeight: !1, activeClass: "fixed-position", positionType: "fixed", extraTop: function()
            {
                var t = 0;
                return jQuery("0").each(function()
                    {
                        t += jQuery(this).outerHeight()
                    }), t
            }
    })
}
jQuery(function()
{
    initStickyScrollBlock()
}),
function(t, i)
{
    "use strict";
    function s(t, i)
    {
        this.options = i,
        this.$stickyBox = t,
        this.init()
    }
    var o = {
            init: function()
            {
                this.findElements(),
                this.attachEvents(),
                this.makeCallback("onInit")
            }, findElements: function()
                {
                    this.$container = this.$stickyBox.closest(this.options.container),
                    this.isWrap = "fixed" === this.options.positionType && this.options.setBoxHeight,
                    this.moveInContainer = !!this.$container.length,
                    this.isWrap && (this.$stickyBoxWrap = this.$stickyBox.wrap('<div class="' + this.getWrapClass() + '"/>').parent()),
                    this.parentForActive = this.getParentForActive(),
                    this.isInit = !0
                }, attachEvents: function()
                {
                    var t = this;
                    this.onResize = function()
                    {
                        t.isInit && (t.resetState(), t.recalculateOffsets(), t.checkStickyPermission(), t.scrollHandler())
                    },
                    this.onScroll = function()
                    {
                        t.scrollHandler()
                    },
                    this.onResize(),
                    i.on("load resize orientationchange", this.onResize).on("scroll", this.onScroll)
                }, defineExtraTop: function()
                {
                    var t;
                    "number" == typeof this.options.extraTop ? t = this.options.extraTop : "function" == typeof this.options.extraTop && (t = this.options.extraTop()),
                    this.extraTop = "absolute" === this.options.positionType ? t : Math.min(this.winParams.height - this.data.boxFullHeight, t)
                }, checkStickyPermission: function()
                {
                    this.isStickyEnabled = !this.moveInContainer || this.data.containerOffsetTop + this.data.containerHeight > this.data.boxFullHeight + this.data.boxOffsetTop + this.options.extraBottom
                }, getParentForActive: function()
                {
                    return this.isWrap ? this.$stickyBoxWrap : this.$container.length ? this.$container : this.$stickyBox
                }, getWrapClass: function()
                {
                    try
                    {
                        return this.$stickyBox.attr("class").split(" ").map(function(t)
                            {
                                return "sticky-wrap-" + t
                            }).join(" ")
                    }
                    catch(t)
                    {
                        return "sticky-wrap"
                    }
                }, resetState: function()
                {
                    this.stickyFlag = !1,
                    this.$stickyBox.css({
                        "-webkit-transition": "", "-webkit-transform": "", transition: "", transform: "", position: "", width: "", left: "", top: ""
                    }).removeClass(this.options.activeClass),
                    this.isWrap && this.$stickyBoxWrap.removeClass(this.options.activeClass).removeAttr("style"),
                    this.moveInContainer && this.$container.removeClass(this.options.activeClass)
                }, recalculateOffsets: function()
                {
                    this.winParams = this.getWindowParams(),
                    this.data = t.extend(this.getBoxOffsets(), this.getContainerOffsets()),
                    this.defineExtraTop()
                }, getBoxOffsets: function()
                {
                    var t,
                        i = "fixed" === this.$stickyBox.css("position") ? ((t = this.$stickyBox.offset()).top = 0, t) : this.$stickyBox.offset(),
                        s = this.$stickyBox.position();
                    return {
                            boxOffsetLeft: i.left, boxOffsetTop: i.top, boxTopPosition: s.top, boxLeftPosition: s.left, boxFullHeight: this.$stickyBox.outerHeight(!0), boxHeight: this.$stickyBox.outerHeight(), boxWidth: this.$stickyBox.outerWidth()
                        }
                }, getContainerOffsets: function()
                {
                    var t = this.moveInContainer ? this.$container.offset() : null;
                    return t ? {
                            containerOffsetLeft: t.left, containerOffsetTop: t.top, containerHeight: this.$container.outerHeight()
                        } : {}
                }, getWindowParams: function()
                {
                    return {height: window.innerHeight || document.documentElement.clientHeight}
                }, makeCallback: function(t)
                {
                    if ("function" == typeof this.options[t])
                    {
                        var i = Array.prototype.slice.call(arguments);
                        i.shift(),
                        this.options[t].apply(this, i)
                    }
                }, destroy: function()
                {
                    this.isInit = !1,
                    i.off("load resize orientationchange", this.onResize).off("scroll", this.onScroll),
                    this.resetState(),
                    this.$stickyBox.removeData("StickyScrollBlock"),
                    this.isWrap && this.$stickyBox.unwrap(),
                    this.makeCallback("onDestroy")
                }
        },
        e = {
            fixed: {
                scrollHandler: function()
                {
                    this.winScrollTop = i.scrollTop(),
                    this.winScrollTop - (this.options.showAfterScrolled ? this.extraTop : 0) - (this.options.showAfterScrolled ? this.data.boxHeight + this.extraTop : 0) > this.data.boxOffsetTop - this.extraTop ? this.isStickyEnabled && this.stickyOn() : this.stickyOff()
                }, stickyOn: function()
                    {
                        this.stickyFlag || (this.stickyFlag = !0, this.parentForActive.addClass(this.options.activeClass), this.$stickyBox.css({
                                width: this.data.boxWidth, position: this.options.positionType
                            }), this.isWrap && this.$stickyBoxWrap.css({height: this.data.boxFullHeight}), this.makeCallback("fixedOn")),
                        this.setDynamicPosition()
                    }, stickyOff: function()
                    {
                        this.stickyFlag && (this.stickyFlag = !1, this.resetState(), this.makeCallback("fixedOff"))
                    }, setDynamicPosition: function()
                    {
                        this.$stickyBox.css({
                            top: this.getTopPosition(), left: this.data.boxOffsetLeft - i.scrollLeft()
                        })
                    }, getTopPosition: function()
                    {
                        if (this.moveInContainer)
                        {
                            var t = this.winScrollTop + this.data.boxHeight + this.options.extraBottom;
                            return Math.min(this.extraTop, this.data.containerHeight + this.data.containerOffsetTop - t)
                        }
                        return this.extraTop
                    }
            }, absolute: {
                    scrollHandler: function()
                    {
                        this.winScrollTop = i.scrollTop(),
                        this.winScrollTop > this.data.boxOffsetTop - this.extraTop ? this.isStickyEnabled && this.stickyOn() : this.stickyOff()
                    }, stickyOn: function()
                        {
                            this.stickyFlag || (this.stickyFlag = !0, this.parentForActive.addClass(this.options.activeClass), this.$stickyBox.css({
                                    width: this.data.boxWidth, transition: "transform " + this.options.animSpeed + "s ease", "-webkit-transition": "transform " + this.options.animSpeed + "s ease"
                                }), this.isWrap && this.$stickyBoxWrap.css({height: this.data.boxFullHeight}), this.makeCallback("fixedOn")),
                            this.clearTimer(),
                            this.timer = setTimeout(function()
                            {
                                this.setDynamicPosition()
                            }.bind(this), 1e3 * this.options.animDelay)
                        }, stickyOff: function()
                        {
                            this.stickyFlag && (this.clearTimer(), this.stickyFlag = !1, this.timer = setTimeout(function()
                                {
                                    this.setDynamicPosition(),
                                    setTimeout(function()
                                    {
                                        this.resetState()
                                    }.bind(this), 1e3 * this.options.animSpeed)
                                }.bind(this), 1e3 * this.options.animDelay), this.makeCallback("fixedOff"))
                        }, clearTimer: function()
                        {
                            clearTimeout(this.timer)
                        }, setDynamicPosition: function()
                        {
                            var t = Math.max(0, this.getTopPosition());
                            this.$stickyBox.css({
                                transform: "translateY(" + t + "px)", "-webkit-transform": "translateY(" + t + "px)"
                            })
                        }, getTopPosition: function()
                        {
                            var t = this.winScrollTop - this.data.boxOffsetTop + this.extraTop;
                            if (this.moveInContainer)
                            {
                                var i = this.winScrollTop + this.data.boxHeight + this.options.extraBottom;
                                return t - Math.abs(Math.min(0, this.data.containerHeight + this.data.containerOffsetTop - i - this.extraTop))
                            }
                            return t
                        }
                }
        };
    t.fn.stickyScrollBlock = function(i)
    {
        var n = Array.prototype.slice.call(arguments),
            a = n[0],
            h = t.extend({
                container: null, positionType: "fixed", activeClass: "fixed-position", setBoxHeight: !0, showAfterScrolled: !1, extraTop: 0, extraBottom: 0, animDelay: .1, animSpeed: .2
            }, i);
        return this.each(function()
            {
                var r = jQuery(this),
                    c = r.data("StickyScrollBlock");
                "object" == typeof i || void 0 === i ? (s.prototype = t.extend(e[h.positionType], o), r.data("StickyScrollBlock", new s(r, h))) : "string" == typeof a && c && "function" == typeof c[a] && (n.shift(), c[a].apply(c, n))
            })
    },
    window.StickyScrollBlock = s
}(jQuery, jQuery(window));
function CiNavCommon()
{
    this.getCurrentNavItem = function(itemId)
    {
        if (!itemId)
        {
            itemId = getCurrentItemId()
        }
        var idx = findIndexWithAttr(_ci.siteNav, "I", itemId);
        if (idx === -1)
        {
            return {
                    item: _ci.siteNav[0], idx: idx
                }
        }
        return {
                item: _ci.siteNav[idx], idx: idx
            }
    };
    this.getParentNavItem = function(current)
    {
        if (!current)
            current = this.getCurrentNavItem();
        var pNode = lookupParentNode(current.item);
        if (!pNode || !pNode.node)
        {
            return this.getCurrentNavItem()
        }
        return this.getCurrentNavItem(pNode.node.I)
    };
    this.isNodeItemHasChildren = isNodeItemHasChildren;
    this.getCurrentItemId = getCurrentItemId;
    this.getChildren = getChildren;
    this.getNodeUrl = getNodeUrl;
    function isNodeItemHasChildren(currentNode)
    {
        var children = getSiblings(currentNode.item.L + 1, currentNode.idx);
        return !!children && children.length > 0
    }
    function lookupParentNode(current)
    {
        var currentIdx = findIndexWithAttr(_ci.siteNav, "I", current.I);
        for (var i = currentIdx; i >= 0; i--)
        {
            var prev = _ci.siteNav[i];
            if (prev.L === current.L - 1)
            {
                return {
                        node: prev, idx: i
                    }
            }
        }
        return {}
    }
    function getSiblings(currentLevel, idx)
    {
        var rtn = [];
        while (true)
        {
            var next = _ci.siteNav[++idx];
            if (next == null || next.L < currentLevel)
                break;
            if (next.L === currentLevel && next.H !== "1")
                rtn.push(next)
        }
        return rtn
    }
    function getCurrentItemId()
    {
        if (!!_ci.ForcedNavItmId)
            return _ci.ForcedNavItmId;
        return _ci.itmId
    }
    function findIndexWithAttr(array, attr, value)
    {
        for (var i = 0; i < array.length; i += 1)
        {
            if (array[i][attr] === value)
            {
                return i
            }
        }
        return -1
    }
    function getChildren(node, idx)
    {
        if (node.L == -1)
        {
            idx = -1
        }
        else if (!idx)
            idx = findIndexWithAttr(_ci.siteNav, "I", node.I);
        return getSiblings(node.L + 1, idx)
    }
    function getNodeUrl(itm)
    {
        if (itm.U === '#')
            return '#';
        if (itm.U.length > 0 && itm.U[0] === '*')
        {
            return itm.U.substr(1)
        }
        return ("/" + (itm.L === -1 ? "/" : (_ci.urlName + '/page/' + itm.I + '/' + itm.U))).replace('//', '/')
    }
    function getSiblingNavItems(current)
    {
        return _ci.siteNav.filter(function(el)
            {
                return el.L === current.L
            })
    }
}
;
;
(function(root, factory)
{
    'use strict';
    if (typeof define === 'function' && define.amd)
    {
        define(['jquery'], factory)
    }
    else if (typeof exports === 'object')
    {
        module.exports = factory(require('jquery'))
    }
    else
    {
        root.SlideAcc2 = factory(jQuery)
    }
}(this, function($)
{
    'use strict';
    var accHiddenClass = 'js-acc-hidden';
    function SlideAcc2(options)
    {
        this.options = $.extend(true, {
            allowClickWhenExpanded: false, activeClass: 'active', opener: '.opener', slider: '.slide', animSpeed: 300, collapsible: true, event: 'click', scrollToActiveItem: {
                    enable: false, breakpoint: 767, animSpeed: 600, extraOffset: null
                }
        }, options);
        this.init()
    }
    SlideAcc2.prototype = {
        init: function()
        {
            if (this.options.holder)
            {
                this.findElements();
                this.setStateOnInit();
                this.attachEvents();
                this.makeCallback('onInit')
            }
        }, findElements: function()
            {
                this.$holder = $(this.options.holder).data('SlideAcc2', this);
                this.$items = this.$holder.find(':has(' + this.options.slider + ')')
            }, setStateOnInit: function()
            {
                var self = this;
                this.$items.each(function()
                {
                    if (!$(this).hasClass(self.options.activeClass))
                    {
                        $(this).find(self.options.slider).addClass(accHiddenClass)
                    }
                })
            }, attachEvents: function()
            {
                var self = this;
                this.accordionToggle = function(e)
                {
                    var $item = jQuery(this).closest(self.$items);
                    var $actiItem = self.getActiveItem($item);
                    if (!self.options.allowClickWhenExpanded || !$item.hasClass(self.options.activeClass))
                    {
                        e.preventDefault();
                        self.toggle($item, $actiItem)
                    }
                };
                this.$holder.on(this.options.event, this.options.opener, this.accordionToggle)
            }, toggle: function($item, $prevItem)
            {
                if (!$item.hasClass(this.options.activeClass))
                {
                    this.show($item)
                }
                else if (this.options.collapsible)
                {
                    this.hide($item)
                }
                if (!$item.is($prevItem) && $prevItem.length)
                {
                    this.hide($prevItem)
                }
                this.makeCallback('beforeToggle')
            }, show: function($item)
            {
                var $slider = $item.find(this.options.slider);
                $item.addClass(this.options.activeClass);
                $slider.stop().hide().removeClass(accHiddenClass).slideDown({
                    duration: this.options.animSpeed, complete: function()
                        {
                            $slider.removeAttr('style');
                            if (this.options.scrollToActiveItem.enable && window.innerWidth <= this.options.scrollToActiveItem.breakpoint)
                            {
                                this.goToItem($item)
                            }
                            this.makeCallback('onShow', $item)
                        }.bind(this)
                });
                this.makeCallback('beforeShow', $item)
            }, hide: function($item)
            {
                var $slider = $item.find(this.options.slider);
                $item.removeClass(this.options.activeClass);
                $slider.stop().show().slideUp({
                    duration: this.options.animSpeed, complete: function()
                        {
                            $slider.addClass(accHiddenClass);
                            $slider.removeAttr('style');
                            this.makeCallback('onHide', $item)
                        }.bind(this)
                });
                this.makeCallback('beforeHide', $item)
            }, goToItem: function($item)
            {
                var itemOffset = $item.offset().top;
                if (itemOffset < $(window).scrollTop())
                {
                    if (typeof this.options.scrollToActiveItem.extraOffset === 'number')
                    {
                        itemOffset -= this.options.scrollToActiveItem.extraOffset
                    }
                    else if (typeof this.options.scrollToActiveItem.extraOffset === 'function')
                    {
                        itemOffset -= this.options.scrollToActiveItem.extraOffset()
                    }
                    $('body, html').animate({scrollTop: itemOffset}, this.options.scrollToActiveItem.animSpeed)
                }
            }, getActiveItem: function($item)
            {
                return $item.siblings().filter('.' + this.options.activeClass)
            }, makeCallback: function(name)
            {
                if (typeof this.options[name] === 'function')
                {
                    var args = Array.prototype.slice.call(arguments);
                    args.shift();
                    this.options[name].apply(this, args)
                }
            }, destroy: function()
            {
                this.$holder.removeData('SlideAcc2');
                this.$items.off(this.options.event, this.options.opener, this.accordionToggle);
                this.$items.removeClass(this.options.activeClass).each(function(i, item)
                {
                    $(item).find(this.options.slider).removeAttr('style').removeClass(accHiddenClass)
                }.bind(this));
                this.makeCallback('onDestroy')
            }
    };
    $.fn.slideAcc2 = function(opt)
    {
        var args = Array.prototype.slice.call(arguments);
        var method = args[0];
        return this.each(function()
            {
                var $holder = jQuery(this);
                var instance = $holder.data('SlideAcc2');
                if (typeof opt === 'object' || typeof opt === 'undefined')
                {
                    new SlideAcc2($.extend(true, {holder: this}, opt))
                }
                else if (typeof method === 'string' && instance)
                {
                    if (typeof instance[method] === 'function')
                    {
                        args.shift();
                        instance[method].apply(instance, args)
                    }
                }
            })
    };
    (function()
    {
        var tabStyleSheet = $('<style type="text/css">')[0];
        var tabStyleRule = '.' + accHiddenClass;
        tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important; width: 100% !important;}';
        if (tabStyleSheet.styleSheet)
        {
            tabStyleSheet.styleSheet.cssText = tabStyleRule
        }
        else
        {
            tabStyleSheet.appendChild(document.createTextNode(tabStyleRule))
        }
        $('head').append(tabStyleSheet)
    }());
    return SlideAcc2
}));
var alreadySetupHamburgerNav = false;
function setupHamburgerNav(node)
{
    if (alreadySetupHamburgerNav)
        return;
    var $holder = $('.ci_nav-burger .nav-list');
    var nav = new CiNavCommon;
    $holder.html('');
    if (node == null)
        node = nav.getCurrentNavItem();
    if (node.item.L > 0 && !nav.isNodeItemHasChildren(node))
    {
        setupHamburgerNav(nav.getParentNavItem());
        return
    }
    var isOnHomePage = window._ci.siteId === window._ci.itmId;
    var activeFolderId = node.item.I;
    var activeItemId = nav.getCurrentItemId();
    var parentNode = nav.getParentNavItem(node);
    var hasParent = node.item.L > 0;
    if (!hasParent)
    {
        parentNode = {item: {
                L: -1, I: -1, T: 'root', U: '/'
            }}
    }
    setupElementKeydownAsParentClick();
    if (isOnHomePage)
        setTimeout(setupMarkup);
    else
        setupMarkup();
    alreadySetupHamburgerNav = true;
    function setupElementKeydownAsParentClick()
    {
        jQuery('.topNav_pclk', '.nav-mask').keydown(function(event)
        {
            if (event.keyCode !== 13)
                return;
            $(this).parent().click()
        })
    }
    function setupMarkup()
    {
        if (hasParent)
        {
            $holder.addClass('hasGoBackBtn');
            $holder.append("<li class='ci_hamburgeritm goBackBurgerLvlBtnWp'><a tabindex='-1' class='goBackBurgerLvlBtn' href='javascript:'><span tabindex='0' class=\"icon-left topNav_pclk\"></span></a></li>")
        }
        else
        {
            $holder.removeClass('hasGoBackBtn')
        }
        $holder.append($('>div.dropmenu>ul>li', $(buildTree(parentNode.item, 0))));
        resetAccordion();
        $('.goBackBurgerLvlBtn', $holder).click(function()
        {
            var parent = nav.isNodeItemHasChildren(node) ? parentNode : nav.getParentNavItem(parentNode);
            setupHamburgerNav(parent)
        })
    }
    function resetAccordion()
    {
        $holder.slideAcc2('destory');
        $holder.slideAcc2({
            opener: '.inner-opener', slider: '.dropmenu', animSpeed: 300
        })
    }
    function buildTree(node, loopLvl)
    {
        var children = nav.getChildren(node);
        var hasChildren = children.length > 0 && loopLvl < 4;
        var isFolderActive = !isOnHomePage && activeFolderId === node.I;
        var isItemActive = activeItemId === node.I;
        var rtn = '';
        if (hasChildren)
        {
            rtn = replaceToken('<li class="ci_hamburgeritm has-drop-down {A}"><a tabindex="-1" href="{U}" class="topnav_lnk ci_tnsectop item has-drop-down-a"><span tabindex="0" >{T}</span><span tabindex="0" class="topnav_opener inner-opener"><span class="ico icon-right"></span></span></a><div class="dropmenu inner-dropmenu js-acc-hidden"><ul class="list-unstyled {LC}">', node, isFolderActive, loopLvl, isItemActive);
            $.each(children, function()
            {
                rtn += buildTree(this, loopLvl + 1)
            });
            rtn += '</ul></div></li>'
        }
        else
        {
            rtn = replaceToken('<li class="ci_hamburgeritm {A}"><a tabindex="-1" href="{U}" class="topnav_lnk item"><span tabindex="0">{T}</span></a></li>', node, isFolderActive, loopLvl, isItemActive)
        }
        return rtn
    }
    function replaceToken(txt, node, isFolderActive, loopLvl, isItemActive)
    {
        var lvl = ' hbrl' + loopLvl;
        return txt.replace("{T}", node.T).replace("{A}", (isFolderActive ? "ci-active active" : "") + (isItemActive ? " ci_itmactive" : "")).replace("{U}", nav.getNodeUrl(node)).replace("{LC}", lvl)
    }
}
jQuery('#nav .nav-opener').mousedown(function()
{
    setupHamburgerNav()
});
jQuery('#nav .nav-opener').keydown(function()
{
    setupHamburgerNav()
});
window.store = {
    localStoreSupport: function()
    {
        try
        {
            return 'localStorage' in window && window['localStorage'] !== null
        }
        catch(e)
        {
            return false
        }
    }, set: function(name, value, days)
        {
            if (days)
            {
                var date = new Date;
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString()
            }
            else
            {
                var expires = ""
            }
            if (this.localStoreSupport())
            {
                localStorage.setItem(name, value)
            }
            else
            {
                document.cookie = name + "=" + value + expires + "; path=/"
            }
        }, get: function(name)
        {
            if (this.localStoreSupport())
            {
                return localStorage.getItem(name)
            }
            else
            {
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++)
                {
                    var c = ca[i];
                    while (c.charAt(0) == ' ')
                        c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) == 0)
                        return c.substring(nameEQ.length, c.length)
                }
                return null
            }
        }, del: function(name)
        {
            if (this.localStoreSupport())
            {
                localStorage.removeItem(name)
            }
            else
            {
                this.set(name, "", -1)
            }
        }
};
function setTxtSize(size)
{
    jQuery('html').removeClass('sizeA3').removeClass('sizeA2').removeClass('sizeA1');
    var fontSize = "";
    if (size === 3)
    {
        fontSize = 'sizeA3';
        jQuery('html').addClass()
    }
    else if (size === 2)
    {
        fontSize = 'sizeA2'
    }
    else
    {
        fontSize = 'sizeA1'
    }
    jQuery('html').addClass(fontSize);
    store.set("ci_font_size", fontSize)
}
function switchHighContrastMode()
{
    if (store.get("ci_high_contrast_mode") === "on")
    {
        store.set("ci_high_contrast_mode", "off");
        jQuery("html").removeClass("ci-highContrast")
    }
    else
    {
        store.set("ci_high_contrast_mode", "on");
        jQuery("html").addClass("ci-highContrast")
    }
}
function checkHighContrastMode()
{
    var htmlClassToAdd = "";
    if (store.get("ci_high_contrast_mode") === "on")
    {
        htmlClassToAdd = "ci-highContrast"
    }
    var ciFontSize = store.get("ci_font_size");
    if (!!ciFontSize && ciFontSize != 'sizeA2')
    {
        htmlClassToAdd += " " + ciFontSize
    }
    jQuery("html").addClass(htmlClassToAdd)
}
function googleTranslateElementInit()
{
    try
    {
        new google.translate.TranslateElement({
            pageLanguage: 'en', autoDisplay: false
        }, 'google_translate_element')
    }
    catch(e) {}
}
jQuery(function($)
{
    checkHighContrastMode();
    setTimeout(function()
    {
        if ($('body').is('.ci_site-s'))
        {
            fixSchoolMainTopPadding();
            positionNav();
            setTimeout(positionNav, 100);
            $(window).resize(onResize)
        }
        initGoogleTranslate()
    }, 100);
    function fixSchoolMainTopPadding()
    {
        jQuery('#main').css('padding-top', jQuery('#header').outerHeight())
    }
    function onResize()
    {
        fixSchoolMainTopPadding();
        positionNav()
    }
    function positionNav()
    {
        $('#nav .nav-drop').css('top', $('#header').outerHeight());
        setTimeout(function()
        {
            $('#nav .nav-drop').css('top', $('#header').outerHeight())
        }, 100)
    }
    function fixPopupFocusCircle()
    {
        $(".ciPopupLastFocus").focus(function()
        {
            var $pp = jQuery(this).parent();
            setTimeout(function()
            {
                jQuery('.ciPopupFirstFocus', $pp).focus()
            })
        })
    }
    fixPopupFocusCircle();
    function initGoogleTranslate()
    {
        try
        {
            loadJsFile("//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit", setupEvents)
        }
        catch(e) {}
        function setupEvents()
        {
            $('.ciggltrans_disp').change(function(event)
            {
                var $me = $(this);
                $('body').click();
                changeGoogleTranslateLanguage($me.val())
            });
            function changeGoogleTranslateLanguage(lng)
            {
                $('.goog-te-combo').val(lng);
                applyChange();
                function applyChange()
                {
                    var gObj = $('.goog-te-combo');
                    var db = gObj.get(0);
                    fireEvent(db, 'change');
                    function fireEvent(el, e)
                    {
                        if (document.createEventObject)
                        {
                            var evt = document.createEventObject();
                            return el.fireEvent('on' + e, evt)
                        }
                        else
                        {
                            var evt = document.createEvent("HTMLEvents");
                            evt.initEvent(e, true, true);
                            return !el.dispatchEvent(evt)
                        }
                    }
                }
            }
        }
    }
    function loadJsFile(n, t)
    {
        var i = document.createElement("script");
        i.type = "text/javascript";
        i.readyState ? i.onreadystatechange = function()
        {
            (i.readyState == "loaded" || i.readyState == "complete") && (i.onreadystatechange = null, t())
        } : i.onload = function()
        {
            t()
        };
        i.src = n;
        document.getElementsByTagName("head")[0].appendChild(i)
    }
    function focusMan()
    {
        var $navdd = $('.nav-drop');
        var $body = $('body');
        $body.focusin(function()
        {
            if ($body.is('.nav-active') && !$navdd[0].contains(document.activeElement))
            {
                $body.click();
                $('#header .ci_ttl_lnk').focus()
            }
        })
    }
    focusMan()
});
/*! fancyBox v2.1.5 fancyapps.com | fancyapps.com/fancybox/#license */
;
(function(r, G, f, v)
{
    var J = f("html"),
        n = f(r),
        p = f(G),
        b = f.fancybox = function()
        {
            b.open.apply(this, arguments)
        },
        I = navigator.userAgent.match(/msie/i),
        B = null,
        s = G.createTouch !== v,
        t = function(a)
        {
            return a && a.hasOwnProperty && a instanceof f
        },
        q = function(a)
        {
            return a && "string" === f.type(a)
        },
        E = function(a)
        {
            return q(a) && 0 < a.indexOf("%")
        },
        l = function(a, d)
        {
            var e = parseInt(a, 10) || 0;
            d && E(a) && (e *= b.getViewport()[d] / 100);
            return Math.ceil(e)
        },
        w = function(a, b)
        {
            return l(a, b) + "px"
        };
    f.extend(b, {
        version: "2.1.5", defaults: {
                padding: 15, margin: 20, width: 800, height: 600, minWidth: 100, minHeight: 100, maxWidth: 9999, maxHeight: 9999, pixelRatio: 1, autoSize: !0, autoHeight: !1, autoWidth: !1, autoResize: !0, autoCenter: !s, fitToView: !0, aspectRatio: !1, topRatio: 0.5, leftRatio: 0.5, scrolling: "auto", wrapCSS: "", arrows: !0, closeBtn: !0, closeClick: !1, nextClick: !1, mouseWheel: !0, autoPlay: !1, playSpeed: 3E3, preload: 3, modal: !1, loop: !0, ajax: {
                        dataType: "html", headers: {"X-fancyBox": !0}
                    }, iframe: {
                        scrolling: "auto", preload: !0
                    }, swf: {
                        wmode: "transparent", allowfullscreen: "true", allowscriptaccess: "always"
                    }, keys: {
                        next: {
                            13: "left", 34: "up", 39: "left", 40: "up"
                        }, prev: {
                                8: "right", 33: "down", 37: "right", 38: "down"
                            }, close: [27], play: [32], toggle: [70]
                    }, direction: {
                        next: "left", prev: "right"
                    }, scrollOutside: !0, index: 0, type: null, href: null, content: null, title: null, tpl: {
                        wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>', image: '<img class="fancybox-image" src="{href}" alt="" />', iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (I ? ' allowtransparency="true"' : "") + "></iframe>", error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>', closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>', next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>', prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
                    }, openEffect: "fade", openSpeed: 250, openEasing: "swing", openOpacity: !0, openMethod: "zoomIn", closeEffect: "fade", closeSpeed: 250, closeEasing: "swing", closeOpacity: !0, closeMethod: "zoomOut", nextEffect: "elastic", nextSpeed: 250, nextEasing: "swing", nextMethod: "changeIn", prevEffect: "elastic", prevSpeed: 250, prevEasing: "swing", prevMethod: "changeOut", helpers: {
                        overlay: !0, title: !0
                    }, onCancel: f.noop, beforeLoad: f.noop, afterLoad: f.noop, beforeShow: f.noop, afterShow: f.noop, beforeChange: f.noop, beforeClose: f.noop, afterClose: f.noop
            }, group: {}, opts: {}, previous: null, coming: null, current: null, isActive: !1, isOpen: !1, isOpened: !1, wrap: null, skin: null, outer: null, inner: null, player: {
                timer: null, isActive: !1
            }, ajaxLoad: null, imgPreload: null, transitions: {}, helpers: {}, open: function(a, d)
            {
                if (a && (f.isPlainObject(d) || (d = {}), !1 !== b.close(!0)))
                    return f.isArray(a) || (a = t(a) ? f(a).get() : [a]), f.each(a, function(e, c)
                        {
                            var k = {},
                                g,
                                h,
                                j,
                                m,
                                l;
                            "object" === f.type(c) && (c.nodeType && (c = f(c)), t(c) ? (k = {
                                href: c.data("fancybox-href") || c.attr("href"), title: c.data("fancybox-title") || c.attr("title"), isDom: !0, element: c
                            }, f.metadata && f.extend(!0, k, c.metadata())) : k = c);
                            g = d.href || k.href || (q(c) ? c : null);
                            h = d.title !== v ? d.title : k.title || "";
                            m = (j = d.content || k.content) ? "html" : d.type || k.type;
                            !m && k.isDom && (m = c.data("fancybox-type"), m || (m = (m = c.prop("class").match(/fancybox\.(\w+)/)) ? m[1] : null));
                            q(g) && (m || (b.isImage(g) ? m = "image" : b.isSWF(g) ? m = "swf" : "#" === g.charAt(0) ? m = "inline" : q(c) && (m = "html", j = c)), "ajax" === m && (l = g.split(/\s+/, 2), g = l.shift(), l = l.shift()));
                            j || ("inline" === m ? g ? j = f(q(g) ? g.replace(/.*(?=#[^\s]+$)/, "") : g) : k.isDom && (j = c) : "html" === m ? j = g : !m && (!g && k.isDom) && (m = "inline", j = c));
                            f.extend(k, {
                                href: g, type: m, content: j, title: h, selector: l
                            });
                            a[e] = k
                        }), b.opts = f.extend(!0, {}, b.defaults, d), d.keys !== v && (b.opts.keys = d.keys ? f.extend({}, b.defaults.keys, d.keys) : !1), b.group = a, b._start(b.opts.index)
            }, cancel: function()
            {
                var a = b.coming;
                a && !1 !== b.trigger("onCancel") && (b.hideLoading(), b.ajaxLoad && b.ajaxLoad.abort(), b.ajaxLoad = null, b.imgPreload && (b.imgPreload.onload = b.imgPreload.onerror = null), a.wrap && a.wrap.stop(!0, !0).trigger("onReset").remove(), b.coming = null, b.current || b._afterZoomOut(a))
            }, close: function(a)
            {
                b.cancel();
                !1 !== b.trigger("beforeClose") && (b.unbindEvents(), b.isActive && (!b.isOpen || !0 === a ? (f(".fancybox-wrap").stop(!0).trigger("onReset").remove(), b._afterZoomOut()) : (b.isOpen = b.isOpened = !1, b.isClosing = !0, f(".fancybox-item, .fancybox-nav").remove(), b.wrap.stop(!0, !0).removeClass("fancybox-opened"), b.transitions[b.current.closeMethod]())))
            }, play: function(a)
            {
                var d = function()
                    {
                        clearTimeout(b.player.timer)
                    },
                    e = function()
                    {
                        d();
                        b.current && b.player.isActive && (b.player.timer = setTimeout(b.next, b.current.playSpeed))
                    },
                    c = function()
                    {
                        d();
                        p.unbind(".player");
                        b.player.isActive = !1;
                        b.trigger("onPlayEnd")
                    };
                if (!0 === a || !b.player.isActive && !1 !== a)
                {
                    if (b.current && (b.current.loop || b.current.index < b.group.length - 1))
                        b.player.isActive = !0,
                        p.bind({
                            "onCancel.player beforeClose.player": c, "onUpdate.player": e, "beforeLoad.player": d
                        }),
                        e(),
                        b.trigger("onPlayStart")
                }
                else
                    c()
            }, next: function(a)
            {
                var d = b.current;
                d && (q(a) || (a = d.direction.next), b.jumpto(d.index + 1, a, "next"))
            }, prev: function(a)
            {
                var d = b.current;
                d && (q(a) || (a = d.direction.prev), b.jumpto(d.index - 1, a, "prev"))
            }, jumpto: function(a, d, e)
            {
                var c = b.current;
                c && (a = l(a), b.direction = d || c.direction[a >= c.index ? "next" : "prev"], b.router = e || "jumpto", c.loop && (0 > a && (a = c.group.length + a % c.group.length), a %= c.group.length), c.group[a] !== v && (b.cancel(), b._start(a)))
            }, reposition: function(a, d)
            {
                var e = b.current,
                    c = e ? e.wrap : null,
                    k;
                c && (k = b._getPosition(d), a && "scroll" === a.type ? (delete k.position, c.stop(!0, !0).animate(k, 200)) : (c.css(k), e.pos = f.extend({}, e.dim, k)))
            }, update: function(a)
            {
                var d = a && a.type,
                    e = !d || "orientationchange" === d;
                e && (clearTimeout(B), B = null);
                b.isOpen && !B && (B = setTimeout(function()
                {
                    var c = b.current;
                    c && !b.isClosing && (b.wrap.removeClass("fancybox-tmp"), (e || "load" === d || "resize" === d && c.autoResize) && b._setDimension(), "scroll" === d && c.canShrink || b.reposition(a), b.trigger("onUpdate"), B = null)
                }, e && !s ? 0 : 300))
            }, toggle: function(a)
            {
                b.isOpen && (b.current.fitToView = "boolean" === f.type(a) ? a : !b.current.fitToView, s && (b.wrap.removeAttr("style").addClass("fancybox-tmp"), b.trigger("onUpdate")), b.update())
            }, hideLoading: function()
            {
                p.unbind(".loading");
                f("#fancybox-loading").remove()
            }, showLoading: function()
            {
                var a,
                    d;
                b.hideLoading();
                a = f('<div id="fancybox-loading"><div></div></div>').click(b.cancel).appendTo("body");
                p.bind("keydown.loading", function(a)
                {
                    if (27 === (a.which || a.keyCode))
                        a.preventDefault(),
                        b.cancel()
                });
                b.defaults.fixed || (d = b.getViewport(), a.css({
                    position: "absolute", top: 0.5 * d.h + d.y, left: 0.5 * d.w + d.x
                }))
            }, getViewport: function()
            {
                var a = b.current && b.current.locked || !1,
                    d = {
                        x: n.scrollLeft(), y: n.scrollTop()
                    };
                a ? (d.w = a[0].clientWidth, d.h = a[0].clientHeight) : (d.w = s && r.innerWidth ? r.innerWidth : n.width(), d.h = s && r.innerHeight ? r.innerHeight : n.height());
                return d
            }, unbindEvents: function()
            {
                b.wrap && t(b.wrap) && b.wrap.unbind(".fb");
                p.unbind(".fb");
                n.unbind(".fb")
            }, bindEvents: function()
            {
                var a = b.current,
                    d;
                a && (n.bind("orientationchange.fb" + (s ? "" : " resize.fb") + (a.autoCenter && !a.locked ? " scroll.fb" : ""), b.update), (d = a.keys) && p.bind("keydown.fb", function(e)
                {
                    var c = e.which || e.keyCode,
                        k = e.target || e.srcElement;
                    if (27 === c && b.coming)
                        return !1;
                    !e.ctrlKey && (!e.altKey && !e.shiftKey && !e.metaKey && (!k || !k.type && !f(k).is("[contenteditable]"))) && f.each(d, function(d, k)
                    {
                        if (1 < a.group.length && k[c] !== v)
                            return b[d](k[c]), e.preventDefault(), !1;
                        if (-1 < f.inArray(c, k))
                            return b[d](), e.preventDefault(), !1
                    })
                }), f.fn.mousewheel && a.mouseWheel && b.wrap.bind("mousewheel.fb", function(d, c, k, g)
                    {
                        for (var h = f(d.target || null), j = !1; h.length && !j && !h.is(".fancybox-skin") && !h.is(".fancybox-wrap"); )
                            j = h[0] && !(h[0].style.overflow && "hidden" === h[0].style.overflow) && (h[0].clientWidth && h[0].scrollWidth > h[0].clientWidth || h[0].clientHeight && h[0].scrollHeight > h[0].clientHeight),
                            h = f(h).parent();
                        if (0 !== c && !j && 1 < b.group.length && !a.canShrink)
                        {
                            if (0 < g || 0 < k)
                                b.prev(0 < g ? "down" : "left");
                            else if (0 > g || 0 > k)
                                b.next(0 > g ? "up" : "right");
                            d.preventDefault()
                        }
                    }))
            }, trigger: function(a, d)
            {
                var e,
                    c = d || b.coming || b.current;
                if (c)
                {
                    f.isFunction(c[a]) && (e = c[a].apply(c, Array.prototype.slice.call(arguments, 1)));
                    if (!1 === e)
                        return !1;
                    c.helpers && f.each(c.helpers, function(d, e)
                    {
                        if (e && b.helpers[d] && f.isFunction(b.helpers[d][a]))
                            b.helpers[d][a](f.extend(!0, {}, b.helpers[d].defaults, e), c)
                    });
                    p.trigger(a)
                }
            }, isImage: function(a)
            {
                return q(a) && a.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i)
            }, isSWF: function(a)
            {
                return q(a) && a.match(/\.(swf)((\?|#).*)?$/i)
            }, _start: function(a)
            {
                var d = {},
                    e,
                    c;
                a = l(a);
                e = b.group[a] || null;
                if (!e)
                    return !1;
                d = f.extend(!0, {}, b.opts, e);
                e = d.margin;
                c = d.padding;
                "number" === f.type(e) && (d.margin = [e, e, e, e]);
                "number" === f.type(c) && (d.padding = [c, c, c, c]);
                d.modal && f.extend(!0, d, {
                    closeBtn: !1, closeClick: !1, nextClick: !1, arrows: !1, mouseWheel: !1, keys: null, helpers: {overlay: {closeClick: !1}}
                });
                d.autoSize && (d.autoWidth = d.autoHeight = !0);
                "auto" === d.width && (d.autoWidth = !0);
                "auto" === d.height && (d.autoHeight = !0);
                d.group = b.group;
                d.index = a;
                b.coming = d;
                if (!1 === b.trigger("beforeLoad"))
                    b.coming = null;
                else
                {
                    c = d.type;
                    e = d.href;
                    if (!c)
                        return b.coming = null, b.current && b.router && "jumpto" !== b.router ? (b.current.index = a, b[b.router](b.direction)) : !1;
                    b.isActive = !0;
                    if ("image" === c || "swf" === c)
                        d.autoHeight = d.autoWidth = !1,
                        d.scrolling = "visible";
                    "image" === c && (d.aspectRatio = !0);
                    "iframe" === c && s && (d.scrolling = "scroll");
                    d.wrap = f(d.tpl.wrap).addClass("fancybox-" + (s ? "mobile" : "desktop") + " fancybox-type-" + c + " fancybox-tmp " + d.wrapCSS).appendTo(d.parent || "body");
                    f.extend(d, {
                        skin: f(".fancybox-skin", d.wrap), outer: f(".fancybox-outer", d.wrap), inner: f(".fancybox-inner", d.wrap)
                    });
                    f.each(["Top", "Right", "Bottom", "Left"], function(a, b)
                    {
                        d.skin.css("padding" + b, w(d.padding[a]))
                    });
                    b.trigger("onReady");
                    if ("inline" === c || "html" === c)
                    {
                        if (!d.content || !d.content.length)
                            return b._error("content")
                    }
                    else if (!e)
                        return b._error("href");
                    "image" === c ? b._loadImage() : "ajax" === c ? b._loadAjax() : "iframe" === c ? b._loadIframe() : b._afterLoad()
                }
            }, _error: function(a)
            {
                f.extend(b.coming, {
                    type: "html", autoWidth: !0, autoHeight: !0, minWidth: 0, minHeight: 0, scrolling: "no", hasError: a, content: b.coming.tpl.error
                });
                b._afterLoad()
            }, _loadImage: function()
            {
                var a = b.imgPreload = new Image;
                a.onload = function()
                {
                    this.onload = this.onerror = null;
                    b.coming.width = this.width / b.opts.pixelRatio;
                    b.coming.height = this.height / b.opts.pixelRatio;
                    b._afterLoad()
                };
                a.onerror = function()
                {
                    this.onload = this.onerror = null;
                    b._error("image")
                };
                a.src = b.coming.href;
                !0 !== a.complete && b.showLoading()
            }, _loadAjax: function()
            {
                var a = b.coming;
                b.showLoading();
                b.ajaxLoad = f.ajax(f.extend({}, a.ajax, {
                    url: a.href, error: function(a, e)
                        {
                            b.coming && "abort" !== e ? b._error("ajax", a) : b.hideLoading()
                        }, success: function(d, e)
                        {
                            "success" === e && (a.content = d, b._afterLoad())
                        }
                }))
            }, _loadIframe: function()
            {
                var a = b.coming,
                    d = f(a.tpl.iframe.replace(/\{rnd\}/g, (new Date).getTime())).attr("scrolling", s ? "auto" : a.iframe.scrolling).attr("src", a.href);
                f(a.wrap).bind("onReset", function()
                {
                    try
                    {
                        f(this).find("iframe").hide().attr("src", "//about:blank").end().empty()
                    }
                    catch(a) {}
                });
                a.iframe.preload && (b.showLoading(), d.one("load", function()
                {
                    f(this).data("ready", 1);
                    s || f(this).bind("load.fb", b.update);
                    f(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();
                    b._afterLoad()
                }));
                a.content = d.appendTo(a.inner);
                a.iframe.preload || b._afterLoad()
            }, _preloadImages: function()
            {
                var a = b.group,
                    d = b.current,
                    e = a.length,
                    c = d.preload ? Math.min(d.preload, e - 1) : 0,
                    f,
                    g;
                for (g = 1; g <= c; g += 1)
                    f = a[(d.index + g) % e],
                    "image" === f.type && f.href && ((new Image).src = f.href)
            }, _afterLoad: function()
            {
                var a = b.coming,
                    d = b.current,
                    e,
                    c,
                    k,
                    g,
                    h;
                b.hideLoading();
                if (a && !1 !== b.isActive)
                    if (!1 === b.trigger("afterLoad", a, d))
                        a.wrap.stop(!0).trigger("onReset").remove(),
                        b.coming = null;
                    else
                    {
                        d && (b.trigger("beforeChange", d), d.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove());
                        b.unbindEvents();
                        e = a.content;
                        c = a.type;
                        k = a.scrolling;
                        f.extend(b, {
                            wrap: a.wrap, skin: a.skin, outer: a.outer, inner: a.inner, current: a, previous: d
                        });
                        g = a.href;
                        switch (c)
                        {
                            case"inline":
                            case"ajax":
                            case"html":
                                a.selector ? e = f("<div>").html(e).find(a.selector) : t(e) && (e.data("fancybox-placeholder") || e.data("fancybox-placeholder", f('<div class="fancybox-placeholder"></div>').insertAfter(e).hide()), e = e.show().detach(), a.wrap.bind("onReset", function()
                                    {
                                        f(this).find(e).length && e.hide().replaceAll(e.data("fancybox-placeholder")).data("fancybox-placeholder", !1)
                                    }));
                                break;
                            case"image":
                                e = a.tpl.image.replace("{href}", g);
                                break;
                            case"swf":
                                e = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + g + '"></param>',
                                h = "",
                                f.each(a.swf, function(a, b)
                                {
                                    e += '<param name="' + a + '" value="' + b + '"></param>';
                                    h += " " + a + '="' + b + '"'
                                }),
                                e += '<embed src="' + g + '" type="application/x-shockwave-flash" width="100%" height="100%"' + h + "></embed></object>"
                        }
                        (!t(e) || !e.parent().is(a.inner)) && a.inner.append(e);
                        b.trigger("beforeShow");
                        a.inner.css("overflow", "yes" === k ? "scroll" : "no" === k ? "hidden" : k);
                        b._setDimension();
                        b.reposition();
                        b.isOpen = !1;
                        b.coming = null;
                        b.bindEvents();
                        if (b.isOpened)
                        {
                            if (d.prevMethod)
                                b.transitions[d.prevMethod]()
                        }
                        else
                            f(".fancybox-wrap").not(a.wrap).stop(!0).trigger("onReset").remove();
                        b.transitions[b.isOpened ? a.nextMethod : a.openMethod]();
                        b._preloadImages()
                    }
            }, _setDimension: function()
            {
                var a = b.getViewport(),
                    d = 0,
                    e = !1,
                    c = !1,
                    e = b.wrap,
                    k = b.skin,
                    g = b.inner,
                    h = b.current,
                    c = h.width,
                    j = h.height,
                    m = h.minWidth,
                    u = h.minHeight,
                    n = h.maxWidth,
                    p = h.maxHeight,
                    s = h.scrolling,
                    q = h.scrollOutside ? h.scrollbarWidth : 0,
                    x = h.margin,
                    y = l(x[1] + x[3]),
                    r = l(x[0] + x[2]),
                    v,
                    z,
                    t,
                    C,
                    A,
                    F,
                    B,
                    D,
                    H;
                e.add(k).add(g).width("auto").height("auto").removeClass("fancybox-tmp");
                x = l(k.outerWidth(!0) - k.width());
                v = l(k.outerHeight(!0) - k.height());
                z = y + x;
                t = r + v;
                C = E(c) ? (a.w - z) * l(c) / 100 : c;
                A = E(j) ? (a.h - t) * l(j) / 100 : j;
                if ("iframe" === h.type)
                {
                    if (H = h.content, h.autoHeight && 1 === H.data("ready"))
                        try
                        {
                            H[0].contentWindow.document.location && (g.width(C).height(9999), F = H.contents().find("body"), q && F.css("overflow-x", "hidden"), A = F.outerHeight(!0))
                        }
                        catch(G) {}
                }
                else if (h.autoWidth || h.autoHeight)
                    g.addClass("fancybox-tmp"),
                    h.autoWidth || g.width(C),
                    h.autoHeight || g.height(A),
                    h.autoWidth && (C = g.width()),
                    h.autoHeight && (A = g.height()),
                    g.removeClass("fancybox-tmp");
                c = l(C);
                j = l(A);
                D = C / A;
                m = l(E(m) ? l(m, "w") - z : m);
                n = l(E(n) ? l(n, "w") - z : n);
                u = l(E(u) ? l(u, "h") - t : u);
                p = l(E(p) ? l(p, "h") - t : p);
                F = n;
                B = p;
                h.fitToView && (n = Math.min(a.w - z, n), p = Math.min(a.h - t, p));
                z = a.w - y;
                r = a.h - r;
                h.aspectRatio ? (c > n && (c = n, j = l(c / D)), j > p && (j = p, c = l(j * D)), c < m && (c = m, j = l(c / D)), j < u && (j = u, c = l(j * D))) : (c = Math.max(m, Math.min(c, n)), h.autoHeight && "iframe" !== h.type && (g.width(c), j = g.height()), j = Math.max(u, Math.min(j, p)));
                if (h.fitToView)
                    if (g.width(c).height(j), e.width(c + x), a = e.width(), y = e.height(), h.aspectRatio)
                        for (; (a > z || y > r) && (c > m && j > u) && !(19 < d++); )
                            j = Math.max(u, Math.min(p, j - 10)),
                            c = l(j * D),
                            c < m && (c = m, j = l(c / D)),
                            c > n && (c = n, j = l(c / D)),
                            g.width(c).height(j),
                            e.width(c + x),
                            a = e.width(),
                            y = e.height();
                    else
                        c = Math.max(m, Math.min(c, c - (a - z))),
                        j = Math.max(u, Math.min(j, j - (y - r)));
                q && ("auto" === s && j < A && c + x + q < z) && (c += q);
                g.width(c).height(j);
                e.width(c + x);
                a = e.width();
                y = e.height();
                e = (a > z || y > r) && c > m && j > u;
                c = h.aspectRatio ? c < F && j < B && c < C && j < A : (c < F || j < B) && (c < C || j < A);
                f.extend(h, {
                    dim: {
                        width: w(a), height: w(y)
                    }, origWidth: C, origHeight: A, canShrink: e, canExpand: c, wPadding: x, hPadding: v, wrapSpace: y - k.outerHeight(!0), skinSpace: k.height() - j
                });
                !H && (h.autoHeight && j > u && j < p && !c) && g.height("auto")
            }, _getPosition: function(a)
            {
                var d = b.current,
                    e = b.getViewport(),
                    c = d.margin,
                    f = b.wrap.width() + c[1] + c[3],
                    g = b.wrap.height() + c[0] + c[2],
                    c = {
                        position: "absolute", top: c[0], left: c[3]
                    };
                d.autoCenter && d.fixed && !a && g <= e.h && f <= e.w ? c.position = "fixed" : d.locked || (c.top += e.y, c.left += e.x);
                c.top = w(Math.max(c.top, c.top + (e.h - g) * d.topRatio));
                c.left = w(Math.max(c.left, c.left + (e.w - f) * d.leftRatio));
                return c
            }, _afterZoomIn: function()
            {
                var a = b.current;
                a && (b.isOpen = b.isOpened = !0, b.wrap.css("overflow", "visible").addClass("fancybox-opened"), b.update(), (a.closeClick || a.nextClick && 1 < b.group.length) && b.inner.css("cursor", "pointer").bind("click.fb", function(d)
                    {
                        !f(d.target).is("a") && !f(d.target).parent().is("a") && (d.preventDefault(), b[a.closeClick ? "close" : "next"]())
                    }), a.closeBtn && f(a.tpl.closeBtn).appendTo(b.skin).bind("click.fb", function(a)
                    {
                        a.preventDefault();
                        b.close()
                    }), a.arrows && 1 < b.group.length && ((a.loop || 0 < a.index) && f(a.tpl.prev).appendTo(b.outer).bind("click.fb", b.prev), (a.loop || a.index < b.group.length - 1) && f(a.tpl.next).appendTo(b.outer).bind("click.fb", b.next)), b.trigger("afterShow"), !a.loop && a.index === a.group.length - 1 ? b.play(!1) : b.opts.autoPlay && !b.player.isActive && (b.opts.autoPlay = !1, b.play()))
            }, _afterZoomOut: function(a)
            {
                a = a || b.current;
                f(".fancybox-wrap").trigger("onReset").remove();
                f.extend(b, {
                    group: {}, opts: {}, router: !1, current: null, isActive: !1, isOpened: !1, isOpen: !1, isClosing: !1, wrap: null, skin: null, outer: null, inner: null
                });
                b.trigger("afterClose", a)
            }
    });
    b.transitions = {
        getOrigPosition: function()
        {
            var a = b.current,
                d = a.element,
                e = a.orig,
                c = {},
                f = 50,
                g = 50,
                h = a.hPadding,
                j = a.wPadding,
                m = b.getViewport();
            !e && (a.isDom && d.is(":visible")) && (e = d.find("img:first"), e.length || (e = d));
            t(e) ? (c = e.offset(), e.is("img") && (f = e.outerWidth(), g = e.outerHeight())) : (c.top = m.y + (m.h - g) * a.topRatio, c.left = m.x + (m.w - f) * a.leftRatio);
            if ("fixed" === b.wrap.css("position") || a.locked)
                c.top -= m.y,
                c.left -= m.x;
            return c = {
                    top: w(c.top - h * a.topRatio), left: w(c.left - j * a.leftRatio), width: w(f + j), height: w(g + h)
                }
        }, step: function(a, d)
            {
                var e,
                    c,
                    f = d.prop;
                c = b.current;
                var g = c.wrapSpace,
                    h = c.skinSpace;
                if ("width" === f || "height" === f)
                    e = d.end === d.start ? 1 : (a - d.start) / (d.end - d.start),
                    b.isClosing && (e = 1 - e),
                    c = "width" === f ? c.wPadding : c.hPadding,
                    c = a - c,
                    b.skin[f](l("width" === f ? c : c - g * e)),
                    b.inner[f](l("width" === f ? c : c - g * e - h * e))
            }, zoomIn: function()
            {
                var a = b.current,
                    d = a.pos,
                    e = a.openEffect,
                    c = "elastic" === e,
                    k = f.extend({opacity: 1}, d);
                delete k.position;
                c ? (d = this.getOrigPosition(), a.openOpacity && (d.opacity = 0.1)) : "fade" === e && (d.opacity = 0.1);
                b.wrap.css(d).animate(k, {
                    duration: "none" === e ? 0 : a.openSpeed, easing: a.openEasing, step: c ? this.step : null, complete: b._afterZoomIn
                })
            }, zoomOut: function()
            {
                var a = b.current,
                    d = a.closeEffect,
                    e = "elastic" === d,
                    c = {opacity: 0.1};
                e && (c = this.getOrigPosition(), a.closeOpacity && (c.opacity = 0.1));
                b.wrap.animate(c, {
                    duration: "none" === d ? 0 : a.closeSpeed, easing: a.closeEasing, step: e ? this.step : null, complete: b._afterZoomOut
                })
            }, changeIn: function()
            {
                var a = b.current,
                    d = a.nextEffect,
                    e = a.pos,
                    c = {opacity: 1},
                    f = b.direction,
                    g;
                e.opacity = 0.1;
                "elastic" === d && (g = "down" === f || "up" === f ? "top" : "left", "down" === f || "right" === f ? (e[g] = w(l(e[g]) - 200), c[g] = "+=200px") : (e[g] = w(l(e[g]) + 200), c[g] = "-=200px"));
                "none" === d ? b._afterZoomIn() : b.wrap.css(e).animate(c, {
                    duration: a.nextSpeed, easing: a.nextEasing, complete: b._afterZoomIn
                })
            }, changeOut: function()
            {
                var a = b.previous,
                    d = a.prevEffect,
                    e = {opacity: 0.1},
                    c = b.direction;
                "elastic" === d && (e["down" === c || "up" === c ? "top" : "left"] = ("up" === c || "left" === c ? "-" : "+") + "=200px");
                a.wrap.animate(e, {
                    duration: "none" === d ? 0 : a.prevSpeed, easing: a.prevEasing, complete: function()
                        {
                            f(this).trigger("onReset").remove()
                        }
                })
            }
    };
    b.helpers.overlay = {
        defaults: {
            closeClick: !0, speedOut: 200, showEarly: !0, css: {}, locked: !s, fixed: !0
        }, overlay: null, fixed: !1, el: f("html"), create: function(a)
            {
                a = f.extend({}, this.defaults, a);
                this.overlay && this.close();
                this.overlay = f('<div class="fancybox-overlay"></div>').appendTo(b.coming ? b.coming.parent : a.parent);
                this.fixed = !1;
                a.fixed && b.defaults.fixed && (this.overlay.addClass("fancybox-overlay-fixed"), this.fixed = !0)
            }, open: function(a)
            {
                var d = this;
                a = f.extend({}, this.defaults, a);
                this.overlay ? this.overlay.unbind(".overlay").width("auto").height("auto") : this.create(a);
                this.fixed || (n.bind("resize.overlay", f.proxy(this.update, this)), this.update());
                a.closeClick && this.overlay.bind("click.overlay", function(a)
                {
                    if (f(a.target).hasClass("fancybox-overlay"))
                        return b.isActive ? b.close() : d.close(), !1
                });
                this.overlay.css(a.css).show()
            }, close: function()
            {
                var a,
                    b;
                n.unbind("resize.overlay");
                this.el.hasClass("fancybox-lock") && (f(".fancybox-margin").removeClass("fancybox-margin"), a = n.scrollTop(), b = n.scrollLeft(), this.el.removeClass("fancybox-lock"), n.scrollTop(a).scrollLeft(b));
                f(".fancybox-overlay").remove().hide();
                f.extend(this, {
                    overlay: null, fixed: !1
                })
            }, update: function()
            {
                var a = "100%",
                    b;
                this.overlay.width(a).height("100%");
                I ? (b = Math.max(G.documentElement.offsetWidth, G.body.offsetWidth), p.width() > b && (a = p.width())) : p.width() > n.width() && (a = p.width());
                this.overlay.width(a).height(p.height())
            }, onReady: function(a, b)
            {
                var e = this.overlay;
                f(".fancybox-overlay").stop(!0, !0);
                e || this.create(a);
                a.locked && (this.fixed && b.fixed) && (e || (this.margin = p.height() > n.height() ? f("html").css("margin-right").replace("px", "") : !1), b.locked = this.overlay.append(b.wrap), b.fixed = !1);
                !0 === a.showEarly && this.beforeShow.apply(this, arguments)
            }, beforeShow: function(a, b)
            {
                var e,
                    c;
                b.locked && (!1 !== this.margin && (f("*").filter(function()
                {
                    return "fixed" === f(this).css("position") && !f(this).hasClass("fancybox-overlay") && !f(this).hasClass("fancybox-wrap")
                }).addClass("fancybox-margin"), this.el.addClass("fancybox-margin")), e = n.scrollTop(), c = n.scrollLeft(), this.el.addClass("fancybox-lock"), n.scrollTop(e).scrollLeft(c));
                this.open(a)
            }, onUpdate: function()
            {
                this.fixed || this.update()
            }, afterClose: function(a)
            {
                this.overlay && !b.coming && this.overlay.fadeOut(a.speedOut, f.proxy(this.close, this))
            }
    };
    b.helpers.title = {
        defaults: {
            type: "float", position: "bottom"
        }, beforeShow: function(a)
            {
                var d = b.current,
                    e = d.title,
                    c = a.type;
                f.isFunction(e) && (e = e.call(d.element, d));
                if (q(e) && "" !== f.trim(e))
                {
                    d = f('<div class="fancybox-title fancybox-title-' + c + '-wrap">' + e + "</div>");
                    switch (c)
                    {
                        case"inside":
                            c = b.skin;
                            break;
                        case"outside":
                            c = b.wrap;
                            break;
                        case"over":
                            c = b.inner;
                            break;
                        default:
                            c = b.skin,
                            d.appendTo("body"),
                            I && d.width(d.width()),
                            d.wrapInner('<span class="child"></span>'),
                            b.current.margin[2] += Math.abs(l(d.css("margin-bottom")))
                    }
                    d["top" === a.position ? "prependTo" : "appendTo"](c)
                }
            }
    };
    f.fn.fancybox = function(a)
    {
        var d,
            e = f(this),
            c = this.selector || "",
            k = function(g)
            {
                var h = f(this).blur(),
                    j = d,
                    k,
                    l;
                !g.ctrlKey && (!g.altKey && !g.shiftKey && !g.metaKey) && !h.is(".fancybox-wrap") && (k = a.groupAttr || "data-fancybox-group", l = h.attr(k), l || (k = "rel", l = h.get(0)[k]), l && ("" !== l && "nofollow" !== l) && (h = c.length ? f(c) : e, h = h.filter("[" + k + '="' + l + '"]'), j = h.index(this)), a.index = j, !1 !== b.open(h, a) && g.preventDefault())
            };
        a = a || {};
        d = a.index || 0;
        !c || !1 === a.live ? e.unbind("click.fb-start").bind("click.fb-start", k) : p.undelegate(c, "click.fb-start").delegate(c + ":not('.fancybox-item, .fancybox-nav')", "click.fb-start", k);
        this.filter("[data-fancybox-start=1]").trigger("click");
        return this
    };
    p.ready(function()
    {
        var a,
            d;
        f.scrollbarWidth === v && (f.scrollbarWidth = function()
        {
            var a = f('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),
                b = a.children(),
                b = b.innerWidth() - b.height(99).innerWidth();
            a.remove();
            return b
        });
        if (f.support.fixedPosition === v)
        {
            a = f.support;
            d = f('<div style="position:fixed;top:20px;"></div>').appendTo("body");
            var e = 20 === d[0].offsetTop || 15 === d[0].offsetTop;
            d.remove();
            a.fixedPosition = e
        }
        f.extend(b.defaults, {
            scrollbarWidth: f.scrollbarWidth(), fixed: f.support.fixedPosition, parent: f("body")
        });
        a = f(r).width();
        J.addClass("fancybox-lock-test");
        d = f(r).width();
        J.removeClass("fancybox-lock-test");
        f("<style type='text/css'>.fancybox-margin{margin-right:" + (d - a) + "px;}</style>").appendTo("head")
    })
})(window, document, jQuery);
jQuery(function()
{
    setupCtnWdgLightBox();
    function setupCtnWdgLightBox()
    {
        var overlay = {css: {background: 'rgba(0, 0, 0, 0.65)'}};
        $('a.lightbox, a[rel*="next"]').fancybox({
            helpers: {overlay: overlay}, afterLoad: afterLoad, beforeShow: function()
                {
                    var imgAlt = $(this.element).find("img").attr("alt");
                    var dataAlt = $(this.element).data("alt");
                    if (imgAlt)
                    {
                        $(".fancybox-image").attr("alt", imgAlt)
                    }
                    else if (dataAlt)
                    {
                        $(".fancybox-image").attr("alt", dataAlt)
                    }
                }
        });
        function afterLoad(current, previous)
        {
            if (current.href.indexOf('#') === 0)
            {
                jQuery(current.href).find('a.close').off('click.fb').on('click.fb', function(e)
                {
                    e.preventDefault();
                    $.fancybox.close()
                })
            }
        }
    }
})
