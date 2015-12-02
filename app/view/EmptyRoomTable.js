var roomIds = [];

Ext.define('IBApp.view.EmptyRoomTable', {
	
	extend: 'Ext.Container',

	xtype: 'emptyroomtable',

    config: {
        /**
         * @cfg {String} viewMode The mode the Calendar will be displayed in. Possible values 'month', 'week' or 'day'.
         */
        viewMode: 'day',

        /**
         * cfg {Number} weekStart Starting day of the week. (0 = Sunday, 1 = Monday ... etc)
         */
        weekStart: 1,

        /**
         * @cfg {String} todayCls CSS class added to the today's date cell
         */
        todayCls: 'today',

        /**
         * @cfg {String} selectedItemCls CSS class added to the date cell that is currently selected
         */
        selectedItemCls: 'selected',

        /**
         * @cfg {String} unselectableCls CSS class added to any date cells that are unselectable
         */
        unselectableCls: 'unselectable',

        emptyCls: 'empty',
        occupiedCls: 'occupied',

        /**
         * @cfg {String} prevMonthCls CSS class added to any date cells that are part of the previous month
         */
        prevMonthCls: 'prev-month',

        /**
         * @cfg {String} nextMonthCls CSS class added to any date cells that are part of the next month
         */
        nextMonthCls: 'next-month',

        /**
         * @cfg {String} weekendCls CSS class added to any date cells that are on the weekend
         */
        weekendCls: 'weekend',

        /**
         * @cfg {String} prevPeriodCls CSS class added to the previous period navigation cell in the calendar's header
         */
        prevPeriodCls: 'goto-prev',

        /**
         * @cfg {String} nextPeriodCls CSS class added to the next period navigation cells in the calendar's header
         */
        nextPeriodCls: 'goto-next',

        /**
         * @cfg {Number} dayTimeSlotSize The number of minutes the Day View's time slot will increment by. Defaults to 30 minutes.
         */
        dayTimeSlotSize: 30,

	    /**
	     * @cfg {Object} timeSlotDateTpls The templates to be used for the rendering of the Date labels. This should be supplied as an object with
	     * a key relating to the template for each View Mode. For example:
	     * {
	     *     day: '<template>',
	     *     month: '<template>',
	     *     week: '<template>'
	     * }
	     *
	     * The values can be either strings (which will be used to create an Ext.XTemplate) or an Ext.XTemplate instance.
	     *
	     * Defaults to:
	     * {
	     *    day   : '<span class="hour">{date:date("g")}</span><span class="am-pm">{date:date("A")}</span>',
	     *    month : '{date:date("j")}',
	     *    week  : '{date:date("j")}'
	     * }
	     */
	    timeSlotDateTpls: {},
	    
	    /**
	     * @cfg {Ext.data.Store} eventStore This config is used when the CalendarView is combined with
	     * the TouchCalendarEvents or TouchCalendarSimpleEvents plugins and is used as the source of
	     * events to render onto the calendar. The Model used in this store should have at the least a Start Date and End Date field
	     * that can be customised from the default values using the 'startEventField' and 'endEventField' config options of the Event plugin.
	     */

	    /**
	     * @cfg {Boolean} hideHalfHourTimeSlotLabels Determines if the half-hour time slot labels are hidden in the Day View.
	     * Defaults to true
	     */
	    hideHalfHourTimeSlotLabels: true,

        value: null,

        store: null,

        baseTpl: [
                    '<table class="{[this.me.getViewMode().toLowerCase()]}">',
                                    '<thead>',
                                        '<tr>',
                                            '<th class="{[this.me.getPrevPeriodCls()]}" style="display: block;">',
                                            '</th>',
                                            '<th>',
                                                '<span>{[Ext.Date.format(values[0].date, "D jS M Y")]}</span>',
                                            '</th>',
                                            '<th class="{[this.me.getNextPeriodCls()]}" style="display: block;">',
                                            '</th>',
                                        '</tr>',
                                    '</thead>',
                      '<tbody>',
                        '<tr>',
                          '<td colspan="3">',
                            '<table class="time-slot-table">',
                              '<tpl for=".">',
                                '<tr class="{[this.getTimeSlotRowCls(values.date)]}">',
                                  '<td class="label">',
                                    '<tpl if="!this.me.getHideHalfHourTimeSlotLabels() || !this.isHalfHour(values.date)">',
                                      '{date:this.formatDate()}',
                                    '</tpl>',
                                  '</td>',
                                  '<td class="time-block-room" colspan="2" datetime="{[this.me.getDateAttribute(values.date)]}">',
                                  '</td>',
                                '</tr>',
                              '</tpl>',
                            '</table>',
                          '</td>',
                        '</tr>',
                      '</tbody>',
                    '</table>'],

        cls: 'touch-calendar-view',

        itemSelector: 'td.time-block-room',

    },

	// default TimeSlot date templates that are merged with the supplied config
	timeSlotDateTplsDefaults: {
		day     : '<span class="hour">{date:date("g")}</span><span class="am-pm">{date:date("A")}</span>',
	},

    /**
   	 * Object containing common functions to be passed to XTemplate for internal use
   	 * @property {Object} commonTemplateFunctions
   	 * @private
   	 */
   	commonTemplateFunctions: {

	    /**
	     * Returns a string of CSS classes to be applied to the time slot's TR tags.
	     * This is only used in the Day View template.
	     * @method
	     * @private
	     * @param {Date} date The date for the current time slot
	     * @return {String} A string of CSS classes
	     */
	    getTimeSlotRowCls: function(date){
		    var classes         = [],
			    isHalfHourly    = date.getMinutes() !== 0;

		    if(isHalfHourly){
			    classes.push('half-hour');
		    }

		    return classes.join(' ');
	    },

	    /**
	     * Returns true determining if the date is a half-hour slot. Only used in the Day View.
	     * @method
	     * @private
	     * @param {Date} date The date for the current time slot.
	     * @return {Boolean}
	     */
	    isHalfHour: function(date){
		    return date.getMinutes() !== 0;
	    },

	    /**
	     * Uses the templates defined in the 'timeSlotDateTpls' config to format the date HTML.
	     * @method
	     * @private
	     * @param {Date} date The date for the current time slot.
	     * @return {String} HTML output from date template
	     */
	    formatDate: function(date){
			return this.getTimeSlotDateTpl().apply({date: date});
	    },

	    /**
	     * Returns the appropriate TimeSlotDateTpl for the current View Mode.
	     * @method
	     * @private
	     * @return {Ext.XTemplate}
	     */
	    getTimeSlotDateTpl: function(){
			var mode = this.me.getViewMode().toLowerCase();

		    return this.me.getTimeSlotDateTpls()[mode];
	    },

   		/**
   		 * Gets the classes that should be applied to the current day's cell
   		 * @method
   		 * @private
   		 * @param {Object} values
   		 * @return {String}
   		 */
   		getClasses: function(values){
   			var classes = [];

   			if(values.selected){
   				classes.push(this.me.getSelectedItemCls());
   			}
   			if(values.unselectable){
   				classes.push(this.me.getUnselectableCls());
   			}
   			// if(values.prevMonth){
   			// 	classes.push(this.me.getPrevMonthCls());
   			// }
   			// if(values.nextMonth){
   			// 	classes.push(this.me.getNextMonthCls());
   			// }
   			// if(values.weekend){
   			// 	classes.push(this.me.getWeekendCls());
   			// }
   			// if(values.today){
   			// 	classes.push(this.me.getTodayCls());
   			// }

   			return classes.join(' ');
   		},

   		/**
   		 * Returns true if the specific index is at the end of the row
   		 * Used to determine if a row terminating tag is needed
   		 * @method
   		 * @private
   		 * @param {Number} currentIndex
   		 * @return {Boolean}
   		 */
   		isEndOfRow: function(currentIndex){
   			return (currentIndex % 7) === 0 && (currentIndex > 0);
   		},

   		/**
   		 * Returns true if the specific index is at the start of the row.
   		 * USed to determine whether if a row opening tag is needed
   		 * @method
   		 * @private
   		 * @param {Number} currentIndex
   		 * @return {Boolean}
   		 */
   		isStartOfRow: function(currentIndex){
   			return ((currentIndex-1) % 7) === 0 && (currentIndex-1 >= 0);
   		},

	    isEndOfPeriod: function(currentIndex){
			return currentIndex % this.me.periodRowDayCount === 0;
	    },

   		/**
   		 * Gets an array containing the first 7 dates to be used in headings
   		 * @method
   		 * @private
   		 * @param {Object} values
   		 * @return {Date[]}
   		 */
   		getDaysArray: function(values){
   			var daysArray = [],
   				i;

   			for(i = 0; i < this.me.periodRowDayCount; i++){
   				daysArray.push(values[i]);
   			}

   			return daysArray;
   		},

      getRoomsArray: function() {
        var roomsArray = [];
        for (var i = 0; i < this.me.periodRowDayCount; i++) {
          var room = {
            'roomId': roomIds[i],
          };
          roomsArray.push(room);
        };

        return roomsArray;
      },

      getRoomNumArray: function() {
        var roomNumArray = [];
        for (var i = 0; i < this.me.periodRowDayCount; i++) {
          var room = {
            'roomNum': roomIds[i].split(':')[1],
          };
          roomNumArray.push(room);
        };
        return roomNumArray;
      },

   		/**
   		 * Gets the class to be added to the header cells
   		 * @method
   		 * @private
   		 * @param {Number} currentIndex
   		 * @return {Boolean}
   		 */
   		// getHeaderClass: function(currentIndex){
   		// 	return currentIndex === 1 ? this.me.getPrevPeriodCls() : currentIndex === 7 ? this.me.getNextPeriodCls() : '';
   		// }
   	},

	constructor: function(config){
		this.initModel();
		
		var store = Ext.create('Ext.data.Store', {
	        model: 'TouchCalendarViewModel'
	    });

	    this.setStore(store);

		// merge the supplied TimeSlot Date tpls with the defaults
		config.timeSlotDateTpls = config.timeSlotDateTpls || {};
		Ext.applyIf(config.timeSlotDateTpls, this.timeSlotDateTplsDefaults);

		Ext.apply(this, config || {
		});
		
        /**
         * @event selectionchange Fires when the Calendar's selected date is changed
         * @param {Ext.ux.TouchCalendarView} this
         * @param {Date} newDate The new selected date
         * @param {Date} oldDate The previously selected date
         */

        /**
         * @event periodchange Fires when the calendar changes to a different date period (i.e. switch using the arrows)
         * @param {Ext.ux.TouchCalendarView} this
         * @param {Date} minDate New view's minimum date
         * @param {Date} maxDate New view's maximum date
         * @param {string} direction Direction that the view moved ('forward' or 'back')
         */
		
		this.callParent(arguments);

		this.minDate = this.minDate ? Ext.Date.clearTime(this.minDate, true) : null;
		this.maxDate = this.maxDate ? Ext.Date.clearTime(this.maxDate, true) : null;

    this.refresh();
  },
    
	/**
	 * Override of onRender method. Attaches event handlers to the element to handler
	 * day taps and period switch taps
	 * @method
	 * @private
	 * @return {void}
	 */
	initialize: function() {

		this.element.on({
			tap: this.onTableHeaderTap,
			scope: this,
			delegate: 'th'
		});

        this.element.on({
            tap: this.onTimeSlotTap,
            scope: this,
            delegate: this.getItemSelector()
        });

        this.on({
            painted: this.syncHeight,
            resize: this.onComponentResize,
		    scope: this
        });

        this.callParent();
	},

	/**
	 * Creates the Calendar's Model if it doesn't already exist
	 * @method
	 * @private
	 */
	initModel: function(){
		if(!Ext.ModelManager.isRegistered('TouchCalendarViewModel')) // TODO: Throws an error in opening Ext.ux.TouchCalendar.html example?? 
		{
			Ext.define('TouchCalendarViewModel', {
				extend: 'Ext.data.Model',
                config: {
                    fields: [
                        {name: 'date', type: 'date'},
                        {name: 'today', type: 'boolean'},
                        {name: 'unselectable', type: 'boolean'},
                        {name: 'selected', type: 'boolean'},
                        {name: 'prevMonth', type: 'boolean'},
                        {name: 'nextMonth', type: 'boolean'},
                        {name: 'weekend', type: 'boolean'},
                        'timeSlots'
                    ]
                }
			});
		}
	},

    /**
     * Updater for the viewMode configuration option.
     * Refreshes the calendar once the new viewMode is applied and set.
     * @param viewMode
     * @param oldViewMode
     */
    // updateViewMode: function(viewMode, oldViewMode){
    //     this.refresh();

	   //  // fire periodchange event
	   //  var minMaxDate = this.getPeriodMinMaxDate();

	   //  this.fireEvent('periodchange', this, minMaxDate.min.get('date'), minMaxDate.max.get('date'), 'none');
    // },
	
	/**
	 * Applies the view mode change requested to the Calendar. Possible values are 'month', 'week' or 'day'.
	 * @param {String} viewMode Either 'month', 'week' or 'day'
	 */
	applyViewMode: function(viewMode){

		viewMode = viewMode.toUpperCase();

        var viewModeFns = IBApp.view.EmptyRoomTable[viewMode.toUpperCase()];

		// Update the mode specific functions/values
        this.getStartDate = viewModeFns.getStartDate;
        this.getTotalDays = viewModeFns.getTotalDays;
        this.dateAttributeFormat = viewModeFns.dateAttributeFormat;
        this.getNextIterationDate = viewModeFns.getNextIterationDate;
        this.getDeltaDate = viewModeFns.getDeltaDate;
        this.periodRowDayCount = viewModeFns.periodRowDayCount;

        Ext.apply(this.commonTemplateFunctions, {me: this})

		// Create the template
		this.setTpl(new Ext.XTemplate((viewModeFns.tpl || this.getBaseTpl()).join(''), this.commonTemplateFunctions));
		
		this.setScrollable({
			direction: viewMode.toUpperCase() === 'DAY' ? 'horizontal' : false,
			directionLock: true
		});
        return viewMode;
	},

  collectData: function(records){
      var data = [];

      Ext.each(records, function(record, index){
          data.push(record.data);
      }, this);

      return data;
  },
	
	/**
	 * Builds a collection of dates that need to be rendered in the current configuration
	 * @method
	 * @private
	 * @return {void}
	 */
	populateStore: function(date){

    if (date == null) {
      this.currentDate = this.currentDate || this.value || new Date();
    }
    else {
      this.currentDate = date;
    }
		
		var unselectable = true, // variable used to indicate whether a day is allowed to be selected
  			baseDate = this.currentDate, // date to use as base
  			iterDate = this.getStartDate(baseDate), // date current mode will start at
  			totalDays = this.getTotalDays(baseDate), // total days to be rendered in current mode
        record;
				
		this.getStore().suspendEvents();
		this.getStore().data.clear();
		
		// create dates based on startDate and number of days to render
		for(var i = 0; i < totalDays; i++){
			// increment the date by one day (except on first run)
			iterDate = this.getNextIterationDate(iterDate, (i===0?0:1));
			unselectable = (this.minDate && iterDate < this.minDate) || (this.maxDate && iterDate > this.maxDate);

      record = Ext.create('TouchCalendarViewModel', {
          today: this.isSameDay(iterDate, new Date()),
          unselectable: unselectable,
          selected: this.isSameDay(iterDate, this.value) && !unselectable,
          prevMonth: (iterDate.getMonth() < baseDate.getMonth()),
          nextMonth: (iterDate.getMonth() > baseDate.getMonth()),
          weekend: this.isWeekend(iterDate),
          date: iterDate
      });
			
			this.getStore().add(record);
		}
		
		this.getStore().resumeEvents();
	},
	
	/**
	 * Refreshes the calendar moving it forward (delta = 1) or backward (delta = -1)
	 * @method
	 * @param {Number} delta - integer representing direction (1 = forward, =1 = backward)
	 * @return {void}
	 */
	refreshDelta: function(delta) {
		var v = this.currentDate || new Date();

		var newDate = this.getDeltaDate(v, delta);

		// don't move if we've reached the min/max dates
		if (this.isOutsideMinMax(newDate)) {
			return;
		}

		this.currentDate = newDate;

		this.refresh();
		
		var minMaxDate = this.getPeriodMinMaxDate();
		
		this.fireEvent('periodchange', this, minMaxDate.min.get('date'), minMaxDate.max.get('date'), (delta > 0 ? 'forward' : 'back'));
	},
	
	/**
	 * Returns the current view's minimum and maximum date collection objects
	 * @method
	 * @private
	 * @return {Object} Object in the format {min: {}, max: {}}
	 */
	getPeriodMinMaxDate: function(){
		return {
			min: this.getStore().data.first(),
			max: this.getStore().data.last()
		};
	},
	
	/**
	 * Returns true or false depending on whether the view that is currently on display is outside or inside the min/max dates set
	 * @method
	 * @private
	 * @param {Date} date A date within the current period, generally the selected date
	 * @return {Boolean}
	 */
	isOutsideMinMax: function(date){
		var outside = false;
		
		if(this.getViewMode() === 'MONTH'){
			outside = ((this.minDate && Ext.Date.getLastDateOfMonth(date) < this.minDate) || (this.maxDate && Ext.Date.getFirstDateOfMonth(date) > this.maxDate));
		} else {
			outside = ((this.minDate && this.getWeekendDate(date) < this.minDate) || (this.maxDate && this.getStartDate(date) > this.maxDate));
		}
		
		return outside;
	},
	
	/**
	 * Handler for a tap on the table header
	 * @method
	 * @private
	 * @param {Object} e
	 * @param {Object} el
	 * @return {void}
	 */
	onTableHeaderTap: function(e, el){
		el = Ext.fly(el);

		if (el.hasCls(this.getPrevPeriodCls()) || el.hasCls(this.getNextPeriodCls())) {
			this.refreshDelta(el.hasCls(this.getPrevPeriodCls()) ? -1 : 1);
		}
	},

  /**
   * Handler for taps on the Calendar's timeslot elements.
   * Processes the tapped element and selects it visually then fires the selectionchange event
   * @method
   * @private
   * @param {Ext.EventObject} e The taps event object
   * @return {void}
   */
  onTimeSlotTap: function(e){
    if( (!e.getTarget('.' + this.getUnselectableCls())) && (e.getTarget('.' + this.getEmptyCls())) ){ // don't do selection if the cell has 'unselectable' class
      var target = Ext.fly(e.getTarget());

      this.selectCell(target);

      var selectedCells = this.element.select('td.' + this.getSelectedItemCls(), this.element.dom);
      
      if (selectedCells.elements.length != 0) {
        if ( !this.isSameRoom(selectedCells) ) {
          Ext.Msg.alert('需要选择同一个会议室');
          // 将该cell的选中取消
          this.selectCell(target);
          return;
        }
        
        if ( this.hasOccupied(selectedCells) ) {
          Ext.Msg.alert('需要选择连续空闲时间');
          // 将该cell的选中取消
          this.selectCell(target);
          return;
        }

        var roomId = this.getCellRoom(selectedCells.first());
        var beginEndTime = this.getBeginEndTime(selectedCells);
        var min = beginEndTime.beginTime;
        var max = beginEndTime.endTime;
        for (var time = min; time <= max;) {
          var cell = this.getDateRoomCell(time, roomId);
          if (cell != null) {
            cell.addCls(this.getSelectedItemCls())
          }

          time = new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), time.getMinutes() + 30);
        };
      }
    }
  },

  isSameRoom: function(selectedCells) {
    var isSame = true;
    var roomId = this.getCellRoom(selectedCells.first());
    
    selectedCells.each(function(cell){
      if (this.getCellRoom(cell) != roomId) {
        isSame = false;
        return false;
      };
    }, this);

    return isSame;
  },

  getBeginEndTime: function(selectedCells) {
    var beginTime = this.getCellDate(selectedCells.first());
    var endTime = this.getCellDate(selectedCells.first());

    selectedCells.each(function(cell){
      var datetime = this.getCellDate(cell);
      if (datetime < beginTime) {
        beginTime = datetime;
      }

      if (datetime > endTime) {
        endTime = datetime;
      }
    }, this);

    return {
      beginTime: beginTime,
      endTime: endTime
    };
  },

  hasOccupied: function(selectedCells) {
    var occupied = false;
    var roomId = this.getCellRoom(selectedCells.first());
    var beginEndTime = this.getBeginEndTime(selectedCells);
    var min = beginEndTime.beginTime;
    var max = beginEndTime.endTime;

    for (var time = min; time <= max;) {
      var cell = this.getDateRoomCell(time, roomId);
      if (cell.hasCls(this.getOccupiedCls())) {
        occupied = true;
        break;
      }

      time = new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), time.getMinutes() + 30);
    };

    return occupied;
  },

	/**
	 * Handler for the component's resize event.
	 * This is required to sync the height of the calendar's table so it keeps filling the screen.
	 * @method
	 * @private
	 * @param comp
	 */
	onComponentResize: function(comp){
		this.syncHeight();
	},

	/**
	 * Override for the Ext.DataView's refresh method. Repopulates the store, calls parent then sync the height of the table
	 * @method
	 */
	refresh: function(date){
		this.populateStore(date);

    var records = this.getStore().getRange();

    this.setData(this.collectData(records));

    this.syncHeight();

    this.syncWidth();

	},

  /**
 	 * Syncs the table's Ext.Element to the height of the Ext.DataView's component. (Only if it isn't in DAY mode)
 	 */
 	syncHeight: function(){
      if (this.getViewMode().toUpperCase() !== 'DAY') {
 			var tableEl = this.element.select('table', this.element.dom).first();

          if(tableEl){
              tableEl.setHeight(this.element.getHeight());
          }
 		}
 	},

  syncWidth: function(){
     if (this.getViewMode().toUpperCase() === 'DAY') {
      var tableEl = this.element.select('table.day', this.element.dom).first();

         if(tableEl){
             tableEl.setWidth(this.periodRowDayCount * 60 + 45);
         }
    }
  },

	/**
	 * Selects the specified cell
	 * @method
	 * @param {Ext.Element} cell
	 */
	selectCell: function(cell){
    var selCls = this.getSelectedItemCls();

    if (cell.hasCls(selCls)) {
      cell.removeCls(selCls);
    }
    else {
      cell.addCls(selCls);
    }
	},
	
	/**
	 * Returns the TouchCalendarViewModel model instance containing the passed in date
	 * @method
	 * @private
	 * @param {Date} date
	 */
	getDateRecord: function(date){
		return this.getStore().findBy(function(record){
			var recordDate = Ext.Date.clearTime(record.get('date'), true).getTime();
                
            return recordDate === Ext.Date.clearTime(date, true).getTime();
		}, this);
	},
	
	/**
	 * Returns the same day
	 * @method
	 * @private
	 * @param {Date} date
	 * @return {Date}
	 */
	getDayStartDate: function(date){
		return date;
	},
	
	/**
	 * Returns true if the two dates are the same date (ignores time)
	 * @method
	 * @private
	 * @param {Date} date1
	 * @param {Date} date2
	 * @return {Boolean}
	 */
	isSameDay: function(date1, date2){
		if(!date1 || !date2){
			return false;
		}
		return Ext.Date.clearTime(date1, true).getTime() === Ext.Date.clearTime(date2, true).getTime();
	},
	
	/**
	 * Returns true if the specified date is a Saturday/Sunday
	 * @method
	 * @private
	 * @param {Object} date
	 * @return {Boolean}
	 */
	isWeekend: function(date){
		return date.getDay() === 0 || date.getDay() === 6;
	},
	
	/**
	 * Returns the last day of the week based on the specified date.
	 * @method
	 * @private
	 * @param {Date} date
	 * @return {Date}
	 */
	getWeekendDate: function(date){
		var dayOffset = date.getDay() - this.getWeekStart();
		dayOffset = dayOffset < 0 ? 6 : dayOffset;
		
		return new Date(date.getFullYear(), date.getMonth(), date.getDate()+0+dayOffset);
	},

	/**
	 * Returns the Date associated with the specified cell
	 * @method
	 * @param {Ext.Element} dateCell
	 * @return {Date}
	 */
	getCellDate: function(dateCell) {
		var date = dateCell.dom.getAttribute('datetime');
		return this.stringToDate(date);
	},

  /* 获取cell对应的roomId */
  getCellRoom: function(dateCell) {
    var roomId = dateCell.dom.getAttribute('roomId');
    return roomId;
  },
	
	/**
	 * Returns the cell representing the specified date
	 * @method
	 * @param {Ext.Element} date
	 * @return {Ext.Element}
	 */
	getDateCell: function(date){
		return this.element.select('td[datetime="' + this.getDateAttribute(date) + '"]', this.element.dom).first();
	},

  /* 根据横坐标时间 纵坐标会议室 选择cell */
  getDateRoomCell: function(date, roomId){
    return this.element.select('td[datetime="' + this.getDateAttribute(date) + '"][roomId="' + roomId + '"]', this.element.dom).first();
  },
	
	/**
	 * Returns a string format of the specified date
	 * Used when assigning the datetime attribute to a table cell
	 * @method
	 * @private
	 * @param {Date} date
	 * @return {String}
	 */
	getDateAttribute: function(date){		
		return Ext.Date.format(date, this.dateAttributeFormat);
	},

	/**
	 * Returns an array of Dates that are selected in the current TouchCalendarView.
	 * @method
	 * @public
	 * @returns {Date[]}
	 */
	getSelected: function(){
		var selectedCells = this.element.select('td.' + this.getSelectedItemCls(), this.element.dom),
			dates = [];

		selectedCells.each(function(cell){
			dates.push(this.getCellDate(cell));
		}, this);

		return dates;
	},

	/**
	 * Converts a string date (used to add to table cells) to a Date object
	 * @method
	 * @private
	 * @param {String} dateString
	 * @return {Date}
	 */
	stringToDate: function(dateString) {
		return Ext.Date.parseDate(dateString, this.dateAttributeFormat);
	},

	/**
	 * Creates an Ext.XTemplate instance for any TimeSlotDateTpls that are defined as strings.
	 * @method
	 * @private
	 * @param {Object} value
	 * @return {Object}
	 */
	applyTimeSlotDateTpls: function(value){
		Ext.Object.each(value, function(key, val){
			if(Ext.isString){
				value[key] = Ext.create('Ext.XTemplate', val);
			}
		}, this)

		return value;
	},

  updateTable: function (cellInfoArray, roomIdsArray) {
    // console.log('cellInfoArray');
    // console.log(cellInfoArray);

    /* roomIdsArray作为列，重绘表格 */
    roomIds = roomIdsArray;
    this.periodRowDayCount = roomIdsArray.length;
    var date = this.periodRowDayCount == 0 ? null : (new Date(cellInfoArray[0].roomDate));
    this.refresh(date);

    // /* 填充cell空闲占用状态 */
    var emptyCls = this.getEmptyCls();
    var emptyEl = this.element.select('.' + emptyCls, this.element.dom);
    if(emptyEl){
        emptyEl.removeCls(emptyCls);
    }

    var occupiedCls = this.getOccupiedCls();
    var occupiedEl = this.element.select('.' + occupiedCls, this.element.dom);
    if(occupiedEl){
        occupiedEl.removeCls(occupiedCls);
    }

    for (var i = 0; i < cellInfoArray.length; i++) {
      var cell = this.getDateRoomCell(new Date(cellInfoArray[i].roomDate), cellInfoArray[i].roomId);
      if (cell != null) {
        if (cellInfoArray[i].roomFlag ==1) {
          cell.addCls(emptyCls);
        }
        else if (cellInfoArray[i].roomFlag == 2) {
          cell.addCls(occupiedCls);
        };
      }
    };
  },

  getSelectionInfo: function() {
    var ret = null;
    var selectedCells = this.element.select('td.' + this.getSelectedItemCls(), this.element.dom);
    
    if (selectedCells.elements.length != 0) {
      var roomId = this.getCellRoom(selectedCells.first());
      var beginEndTime = this.getBeginEndTime(selectedCells);
      var min = beginEndTime.beginTime;
      var max = beginEndTime.endTime;

      ret = {
        roomId: roomId,
        begin: min,
        end: max,
      };

      return ret;
    };
  },
	
	statics: {			
			DAY: {
					/**
					 * Date format that the 'datetime' attribute, given to each time slot, has. Day mode needs the time in aswell so
					 * events etc know what time slot it is
					 */
					dateAttributeFormat: 'd-m-Y H:i',
						
					/**
					 * Template for the DAY view
					 */
					tpl: [
						'<table class="{[this.me.getViewMode().toLowerCase()]}">',
							'<tbody>',
								'<tr>',
									'<td>',
										'<table class="time-slot-table">',
                      '<tr>',
                        '<td class="label"></td>',
                        '<tpl for="this.getRoomNumArray()">',
                          '<td>{roomNum}</td>',
                        '</tpl>',
                      '</tr>',
											'<tpl for=".">',
												'<tr class="{[this.getTimeSlotRowCls(values.date)]}">',
													'<td class="label">',
														'<tpl if="!this.me.getHideHalfHourTimeSlotLabels() || !this.isHalfHour(values.date)">',
															'{date:this.formatDate()}',
														'</tpl>',
													'</td>',
                          '<tpl for="this.getRoomsArray()">',
                            '<td class="time-block-room" datetime="{[this.me.getDateAttribute(parent.date)]}" roomId="{roomId}">',
  													'</td>',
                          '</tpl>',
												'</tr>',
											'</tpl>',
										'</table>',
									'</td>',
								'</tr>',
							'</tbody>',
						'</table>'],
						
					/**
					 * Called during the View's Store population. This calculates the next date for the current period.
					 * The DAY mode's version just adds another time period on.
					 * @param {Date} currentIterationDate
					 * @param {Number} index
					 */
					getNextIterationDate: function(currentIterationDate, index){
						var d = currentIterationDate.getTime() + ((index===0?0:1) * (this.getDayTimeSlotSize() * 60 * 1000));
						
						return new Date(d);
					},
	
					/**
					 * Returns the total number of time slots to be shown in this view.
					 * This is derived from the dayTimeSlotSize property
					 * @method
					 * @private
					 * @param {Date} date
					 */
					getTotalDays: function(date){
            /* 会议从7:00到22:00 16h * 60m */
						return 1440 / this.getDayTimeSlotSize();
					},
					
					/**
					 * Returns the same date as passed in because there is only one date visible
					 * @method
					 * @private
					 * @param {Date} date
					 * @return {Date}
					 */
					getStartDate: function(date){
            // var day = date.getDate(),
            //     month = date.getMonth(),
            //     year = date.getFullYear();
            // return new Date(year, month, day,7,0,0);
						return Ext.Date.clearTime(date, true);
					},
					
					/**
					 * Returns a new date based on the date passed and the delta value for DAY view.
					 * @method
					 * @private
					 * @param {Date} date
					 * @param {Number} delta
					 * @return {Date}
					 */
					getDeltaDate: function(date, delta){
						return new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
					},

					periodRowDayCount: 0
				}
	}
});

