// Generated by CoffeeScript 1.6.3
(function() {
  define(['aloha', 'aloha/plugin', 'jquery', 'aloha/ephemera', 'ui/ui', 'ui/button', './xpath'], function(Aloha, Plugin, $, Ephemera, Ui, Button, XPath) {
    return Plugin.create('undoredo', {
      _observer: null,
      _mutations: [],
      _versions: [],
      _ptr: 0,
      _undobutton: null,
      _redobutton: null,
      disable: function() {
        return this._observer.disconnect();
      },
      enable: function(editable) {
        this._observer.takeRecords();
        return this._observer.observe(editable, {
          attributes: false,
          childList: true,
          characterData: true,
          characterDataOldValue: true,
          subtree: true
        });
      },
      addVersion: function(node) {
        var f;
        f = document.createDocumentFragment();
        f.appendChild(node.cloneNode(true));
        this._versions.length = this._ptr;
        this._versions.push({
          xpath: XPath.xpathFor(node),
          fragment: f
        });
        if (this._versions.length > 10) {
          this._versions.shift();
        }
        return this._ptr = this._versions.length;
      },
      init: function() {
        var plugin,
          _this = this;
        plugin = this;
        Aloha.bind('aloha-editable-created', function(evt, editable) {
          var emap, ephemera_selector, timeoutID;
          if (!editable.obj.is('.aloha-root-editable')) {
            return;
          }
          emap = Ephemera.ephemera().classMap;
          ephemera_selector = (Object.keys(emap).map(function(c) {
            return '.' + c;
          })).join(',');
          timeoutID = null;
          plugin._observer = new MutationObserver(function(mutations) {
            mutations = mutations.filter(function(m) {
              return !$(m.target).is(ephemera_selector);
            });
            if (mutations.length) {
              plugin._mutations = plugin._mutations.concat(mutations);
              if (timeoutID) {
                clearTimeout(timeoutID);
              }
              return timeoutID = setTimeout(function() {
                var mutation, top, _i, _len, _ref;
                timeoutID = null;
                if (plugin._mutations.length) {
                  top = plugin._mutations[0].target;
                  _ref = plugin._mutations.slice(1);
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    mutation = _ref[_i];
                    while (top && top !== mutation.target && !$(top).has(mutation.target).length) {
                      top = top.parentElement;
                    }
                  }
                  plugin.addVersion(top);
                  return plugin._mutations = [];
                }
              }, 2000);
            }
          });
          return plugin.enable(editable.obj[0]);
        });
        Aloha.bind('aloha-editable-destroyed', function() {
          return this.disable();
        });
        this._undobutton = Ui.adopt("undo", Button, {
          tooltip: "Undo",
          icon: "aloha-icon aloha-icon-undo",
          scope: 'Aloha.continuoustext',
          click: function() {
            return _this.undo();
          }
        });
        return this._redobutton = Ui.adopt("redo", Button, {
          tooltip: "Redo",
          icon: "aloha-icon aloha-icon-redo",
          scope: 'Aloha.continuoustext',
          click: function() {
            return _this.redo();
          }
        });
      },
      restore: function(v) {
        var node;
        node = XPath.nodeFor(v.xpath);
        if (node) {
          this.disable;
          $(node).empty().append(v.fragment.firstChild.cloneNode(true).childNodes);
          return this.enable(Aloha.activeEditable.obj[0]);
        }
      },
      undo: function() {
        var v;
        if (this._ptr > 1) {
          this._ptr--;
          v = this._versions[this._ptr - 1];
          this.restore(v);
        }
        return this._ptr;
      },
      redo: function() {
        var v;
        if (this._ptr < this._versions.length) {
          this._ptr++;
          v = this._versions[this._ptr - 1];
          this.restore(v);
        }
        return this._ptr;
      },
      reset: function() {
        this._ptr = 0;
        return this.addVersion(Aloha.activeEditable.obj[0]);
      }
    });
  });

}).call(this);
