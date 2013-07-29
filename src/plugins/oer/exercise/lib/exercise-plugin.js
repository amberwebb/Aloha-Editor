// Generated by CoffeeScript 1.5.0
(function() {

  define(['aloha', 'aloha/plugin', 'jquery', 'aloha/ephemera', 'ui/ui', 'ui/button', 'semanticblock/semanticblock-plugin', 'css!exercise/css/exercise-plugin.css'], function(Aloha, Plugin, jQuery, Ephemera, UI, Button, semanticBlock) {
    var SOLUTION_TEMPLATE, SOLUTION_TYPE_CONTAINER, TEMPLATE, TYPE_CONTAINER, activateExercise, activateSolution, deactivateExercise, deactivateSolution;
    TEMPLATE = '<div class="exercise">\n    <div class="problem"></div>\n</div>';
    SOLUTION_TEMPLATE = '<div class="solution">\n</div> ';
    TYPE_CONTAINER = '<div class="type-container dropdown aloha-ephemera">\n    <a class="type" data-toggle="dropdown"></a>\n    <ul class="dropdown-menu">\n        <li><a href="">Exercise</a></li>\n        <li><a href="">Homework</a></li>\n        <li><a href="">Problem</a></li>\n        <li><a href="">Question</a></li>\n        <li><a href="">Task</a></li>\n    </ul>\n</div>';
    SOLUTION_TYPE_CONTAINER = '<div class="type-container dropdown aloha-ephemera">\n    <a class="type" data-toggle="dropdown"></a>\n    <ul class="dropdown-menu">\n        <li><a href="">Answer</a></li>\n        <li><a href="">Solution</a></li>\n    </ul>\n</div>';
    activateExercise = function($element) {
      var $problem, $solutions, $typeContainer, type,
        _this = this;
      type = $element.attr('data-type') || 'exercise';
      $problem = $element.children('.problem');
      $solutions = $element.children('.solution');
      $element.children().remove();
      $typeContainer = jQuery(TYPE_CONTAINER);
      $typeContainer.find('.type').text(type.charAt(0).toUpperCase() + type.slice(1));
      $typeContainer.find('.dropdown-menu li').each(function(i, li) {
        if (jQuery(li).children('a').text().toLowerCase() === type) {
          return jQuery(li).addClass('checked');
        }
      });
      $typeContainer.prependTo($element);
      $problem.attr('placeholder', "Type the text of your problem here.").appendTo($element).addClass('aloha-block-dropzone').aloha();
      jQuery('<div>').addClass('solutions').addClass('aloha-ephemera-wrapper').appendTo($element).append($solutions);
      jQuery('<div>').addClass('solution-controls').addClass('aloha-ephemera').append('<a class="add-solution">Click here to add an answer/solution</a>').append('<a class="solution-toggle">show solution</a>').appendTo($element);
      if (!$solutions.length) {
        return $element.children('.solution-controls').children('.solution-toggle').hide();
      }
    };
    deactivateExercise = function($element) {
      var $problem, $solutions;
      $problem = $element.children('.problem');
      $solutions = $element.children('.solution');
      if ($problem.html() === '' || $problem.html() === '<p></p>') {
        $problem.html('&nbsp;');
      }
      $element.children().remove();
      jQuery("<div>").addClass('problem').html(jQuery('<p>').append($problem.html())).appendTo($element);
      return $element.append($solutions);
    };
    activateSolution = function($element) {
      var $body, $typeContainer, type,
        _this = this;
      type = $element.attr('data-type') || 'solution';
      $body = $element.children();
      $element.children().remove();
      $typeContainer = jQuery(SOLUTION_TYPE_CONTAINER);
      $typeContainer.find('.type').text(type.charAt(0).toUpperCase() + type.slice(1));
      $typeContainer.find('.dropdown-menu li').each(function(i, li) {
        if (jQuery(li).children('a').text().toLowerCase() === type) {
          return jQuery(li).addClass('checked');
        }
      });
      $typeContainer.prependTo($element);
      return jQuery('<div>').addClass('body').appendTo($element).aloha().append($body).addClass('aloha-block-dropzone');
    };
    deactivateSolution = function($element) {
      var content;
      content = $element.children('.body').html();
      $element.children().remove();
      return jQuery('<p>').append(content).appendTo($element);
    };
    return Plugin.create('exercise', {
      getLabel: function($element) {
        if ($element.is('.exercise')) {
          return 'Exercise';
        } else if ($element.is('.solution')) {
          return 'Solution';
        }
      },
      activate: function($element) {
        if ($element.is('.exercise')) {
          return activateExercise($element);
        } else if ($element.is('.solution')) {
          return activateSolution($element);
        }
      },
      deactivate: function($element) {
        if ($element.is('.exercise')) {
          return deactivateExercise($element);
        } else if ($element.is('.solution')) {
          return deactivateSolution($element);
        }
      },
      selector: '.exercise,.solution',
      ignore: '.problem',
      init: function() {
        semanticBlock.register(this);
        UI.adopt('insertExercise', Button, {
          click: function() {
            return semanticBlock.insertAtCursor(TEMPLATE);
          }
        });
        semanticBlock.registerEvent('click', '.exercise .solution-controls a.add-solution', function() {
          var controls, exercise;
          exercise = $(this).parents('.exercise').first();
          controls = exercise.children('.solution-controls');
          controls.children('.solution-toggle').text('hide solution').show();
          return semanticBlock.appendElement($(SOLUTION_TEMPLATE), exercise.children('.solutions'));
        });
        semanticBlock.registerEvent('click', '.exercise .solution-controls a.solution-toggle', function() {
          var controls, exercise, solutions;
          exercise = $(this).parents('.exercise').first();
          controls = exercise.children('.solution-controls');
          solutions = exercise.children('.solutions');
          return solutions.slideToggle(function() {
            if (solutions.is(':visible')) {
              return controls.children('.solution-toggle').text('hide solution');
            } else {
              return controls.children('.solution-toggle').text('show solution');
            }
          });
        });
        semanticBlock.registerEvent('click', '.exercise .semantic-delete', function() {
          var controls, exercise;
          exercise = $(this).parents('.exercise').first();
          controls = exercise.children('.solution-controls');
          controls.children('.add-solution').show();
          if (exercise.children('.solutions').children().length === 1) {
            return controls.children('.solution-toggle').hide();
          }
        });
        return semanticBlock.registerEvent('click', '.aloha-oer-block.solution > .type-container > ul > li > a,\
                                              .aloha-oer-block.exercise > .type-container > ul > li > a', function(e) {
          var _this = this;
          e.preventDefault();
          jQuery(this).parents('.type-container').first().children('.type').text(jQuery(this).text());
          jQuery(this).parents('.aloha-oer-block').first().attr('data-type', jQuery(this).text().toLowerCase());
          return jQuery(this).parents('.type-container').find('.dropdown-menu li').each(function(i, li) {
            jQuery(li).removeClass('checked');
            if (jQuery(li).children('a').text() === jQuery(_this).text()) {
              return jQuery(li).addClass('checked');
            }
          });
        });
      }
    });
  });

}).call(this);
