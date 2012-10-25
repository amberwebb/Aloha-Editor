// Generated by CoffeeScript 1.3.3
(function() {

  require(['testutils'], function(TestUtils) {
    return Aloha.ready(function() {
      return Aloha.require(['bubble/bubble-plugin'], function(Bubble) {
        var POPOVER_VISIBLE, POPULATED, timeout;
        timeout = function(ms, func) {
          return setTimeout(func, ms);
        };
        POPULATED = null;
        POPOVER_VISIBLE = null;
        Bubble.register({
          selector: '.interesting',
          filter: function() {
            return Aloha.jQuery(this).hasClass('interesting');
          },
          focus: function() {
            return POPOVER_VISIBLE = true;
          },
          blur: function() {
            return POPOVER_VISIBLE = false;
          },
          populator: function($el) {
            return POPULATED = {
              dom: $el,
              popover: this
            };
          }
        });
        module('Popover (generic)', {
          setup: function() {
            this.edit = Aloha.jQuery('#edit');
            this.edit.html('');
            this.edit.aloha();
            return POPULATED = null;
          },
          teardown: function() {
            this.edit.mahalo();
            return POPULATED = null;
          }
        });
        asyncTest('element mouseenter', function() {
          var $boring, $interesting;
          expect(2);
          Aloha.jQuery('<span class="boring">boring</span><span class="interesting">interesting</span>').appendTo(this.edit);
          $boring = this.edit.find('.boring');
          $interesting = this.edit.find('.interesting');
          this.edit.focus();
          ok(!POPULATED, 'The popover hould not have displayed yet');
          $interesting.trigger('mouseenter');
          return timeout(3000, function() {
            ok(POPULATED, 'The popover should have popped up');
            return start();
          });
        });
        asyncTest('element click', function() {
          var $boring, $interesting;
          expect(2);
          Aloha.jQuery('<span class="boring">boring</span><span class="interesting">interesting</span>').appendTo(this.edit);
          $boring = this.edit.find('.boring');
          $interesting = this.edit.find('.interesting');
          TestUtils.setCursor(this.edit, $boring[0], 1);
          ok(!POPULATED, 'The popover should not have displayed yet');
          TestUtils.setCursor(this.edit, $interesting[0], 1);
          return timeout(2000, function() {
            ok(POPULATED, 'The popover should have popped up');
            return start();
          });
        });
        return asyncTest('popover mouseenter (Make sure the popover does not hide when mouse moves onto the popover)', function() {
          var $boring, $interesting;
          expect(4);
          Aloha.jQuery('<span class="boring">boring</span><span class="interesting">interesting</span>').appendTo(this.edit);
          $boring = this.edit.find('.boring');
          $interesting = this.edit.find('.interesting');
          TestUtils.setCursor(this.edit, $boring[0], 1);
          ok(!POPULATED, 'The popover should not have displayed yet');
          $interesting.trigger('mouseenter');
          return timeout(3000, function() {
            ok(POPULATED, 'The popover should have popped up');
            ok(POPOVER_VISIBLE, 'The popover should be visible');
            $interesting.trigger('mouseleave');
            return timeout(100, function() {
              POPULATED.popover.trigger('mouseenter');
              return timeout(5000, function() {
                ok(POPOVER_VISIBLE, 'Popover should still be visible');
                return start();
              });
            });
          });
        });
      });
    });
  });

}).call(this);
