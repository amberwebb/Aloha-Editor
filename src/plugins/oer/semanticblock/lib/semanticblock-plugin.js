// Generated by CoffeeScript 1.5.0
(function() {

  define(['aloha', 'block/blockmanager', 'aloha/plugin', 'aloha/pluginmanager', 'jquery', 'aloha/ephemera', 'ui/ui', 'ui/button', 'css!semanticblock/css/semanticblock-plugin.css'], function(Aloha, BlockManager, Plugin, pluginManager, jQuery, Ephemera, UI, Button) {
    var activate, activateHandlers, bindEvents, blockControls, blockDragHelper, blockTemplate, deactivate, deactivateHandlers, insertElement, pluginEvents;
    if (pluginManager.plugins.semanticblock) {
      return pluginManager.plugins.semanticblock;
    }
    blockTemplate = jQuery('<div class="semantic-container"></div>');
    blockControls = jQuery('<div class="semantic-controls"><button class="semantic-delete"><i class="icon-remove"></i></button><button><i class="icon-cog"></i></button></div>');
    blockDragHelper = jQuery('<div class="semantic-drag-helper"><div class="title"></div><div class="body">Drag me to the desired location in the document</div></div>');
    activateHandlers = {};
    deactivateHandlers = {};
    pluginEvents = [
      {
        name: 'mouseenter',
        selector: '.aloha-block-draghandle',
        callback: function() {
          return jQuery(this).parents('.semantic-container').addClass('drag-active');
        }
      }, {
        name: 'mouseleave',
        selector: '.aloha-block-draghandle',
        callback: function() {
          if (!jQuery(this).parents('.semantic-container').data('dragging')) {
            return jQuery(this).parents('.semantic-container').removeClass('drag-active');
          }
        }
      }, {
        name: 'mousedown',
        selector: '.aloha-block-draghandle',
        callback: function(e) {
          e.preventDefault();
          return jQuery(this).parents('.semantic-container').data('dragging', true);
        }
      }, {
        name: 'mouseup',
        selector: '.aloha-block-draghandle',
        callback: function() {
          return jQuery(this).parents('.semantic-container').data('dragging', false);
        }
      }, {
        name: 'click',
        selector: '.semantic-container .semantic-delete',
        callback: function(e) {
          e.preventDefault();
          return jQuery(this).parents('.semantic-container').first().slideUp('slow', function() {
            return jQuery(this).remove();
          });
        }
      }, {
        name: 'mouseover',
        selector: '.semantic-container',
        callback: function() {
          jQuery(this).parents('.semantic-container').removeClass('focused');
          if (!jQuery(this).find('.focused').length) {
            return jQuery(this).addClass('focused');
          }
        }
      }, {
        name: 'mouseout',
        selector: '.semantic-container',
        callback: function() {
          return jQuery(this).removeClass('focused');
        }
      }, {
        name: 'click',
        selector: '.aloha-oer-block .title-container li a',
        callback: function(e) {
          e.preventDefault();
          jQuery(this).parents('.title-container').first().children('.type').text(jQuery(this).text());
          return jQuery(this).parents('.aloha-oer-block').first().attr('data-type', jQuery(this).text().toLowerCase());
        }
      }
    ];
    insertElement = function(element) {};
    activate = function(element) {
      var type, _results;
      if (!element.parent('.semantic-container').length) {
        element.addClass('aloha-oer-block');
        element.wrap(blockTemplate).parent().append(blockControls.clone()).alohaBlock();
        type = void 0;
        _results = [];
        for (type in activateHandlers) {
          if (element.hasClass(type)) {
            activateHandlers[type](element);
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };
    deactivate = function(element) {
      var type;
      if (element.parent('.semantic-container').length) {
        element.removeClass('aloha-oer-block ui-draggable');
        element.removeAttr('style');
        type = void 0;
        for (type in deactivateHandlers) {
          if (element.hasClass(type)) {
            deactivateHandlers[type](element);
            break;
          }
        }
        element.siblings('.semantic-controls').remove();
        return element.unwrap();
      }
    };
    bindEvents = function(element) {
      var event, i, _results;
      if (element.data('oerBlocksInitialized')) {
        return;
      }
      element.data('oerBlocksInitialized', true);
      event = void 0;
      i = void 0;
      i = 0;
      _results = [];
      while (i < pluginEvents.length) {
        event = pluginEvents[i];
        element.on(event.name, event.selector, event.callback);
        _results.push(i++);
      }
      return _results;
    };
    Aloha.ready(function() {
      return bindEvents(jQuery(document));
    });
    return Plugin.create('semanticblock', {
      makeClean: function(content) {
        var type, _results;
        _results = [];
        for (type in deactivateHandlers) {
          _results.push(content.find('.aloha-oer-block.' + type).each(function() {
            return deactivate(jQuery(this));
          }));
        }
        return _results;
      },
      init: function() {
        var _this = this;
        Aloha.bind('aloha-editable-activated', function(e, params) {
          var element;
          element = jQuery(params.editable.obj);
          if (element.attr('placeholder')) {
            element.removeClass('placeholder');
            if (element.attr('placeholder') === element.text()) {
              return element.text('');
            }
          }
        });
        Aloha.bind('aloha-editable-deactivated', function(e, params) {
          var element;
          element = jQuery(params.editable.obj);
          if (element.attr('placeholder') && element.text() === '') {
            element.text(element.attr('placeholder'));
            return element.addClass('placeholder');
          }
        });
        return Aloha.bind('aloha-editable-created', function(e, params) {
          var $root, classes, cls;
          $root = params.obj;
          classes = [];
          for (cls in activateHandlers) {
            classes.push("." + cls);
          }
          $root.find(classes.join()).each(function(i, el) {
            var $el;
            $el = jQuery(el);
            if (!$el.parents('.semantic-drag-source').length) {
              return activate($el);
            }
          });
          if ($root.is('.aloha-block-blocklevel-sortable') && !$root.parents('.aloha-editable').length) {
            jQuery('.semantic-drag-source').children().each(function() {
              var element;
              element = jQuery(this);
              return element.draggable({
                connectToSortable: $root,
                revert: 'invalid',
                helper: function() {
                  var helper;
                  helper = jQuery(blockDragHelper).clone();
                  helper.find('.title').text('im a helper');
                  return helper;
                },
                start: function(e, ui) {
                  $root.addClass('aloha-block-dropzone');
                  return jQuery(ui.helper).addClass('dragging');
                },
                refreshPositions: true
              });
            });
            return $root.sortable('option', 'stop', function(e, ui) {
              var $el;
              $el = jQuery(ui.item);
              return activate($el);
            });
          }
        });
      },
      insertAtCursor: function(template) {
        var element, range;
        element = blockTemplate.clone().append(template);
        range = Aloha.Selection.getRangeObject();
        element.addClass('semantic-temp');
        GENTICS.Utils.Dom.insertIntoDOM(element, range, Aloha.activeEditable.obj);
        element = Aloha.jQuery('.semantic-temp').removeClass('semantic-temp');
        return activate(element);
      },
      appendElement: function(element, target) {
        element.addClass('semantic-temp');
        target.append(element);
        element = Aloha.jQuery('.semantic-temp').removeClass('semantic-temp');
        return activate(element);
      },
      activateHandler: function(type, handler) {
        return activateHandlers[type] = handler;
      },
      deactivateHandler: function(type, handler) {
        return deactivateHandlers[type] = handler;
      },
      registerEvent: function(name, selector, callback) {
        return pluginEvents.push({
          name: name,
          selector: selector,
          callback: callback
        });
      }
    });
  });

}).call(this);
