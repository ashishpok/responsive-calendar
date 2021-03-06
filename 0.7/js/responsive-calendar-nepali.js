// Generated by CoffeeScript 1.6.1

/*!
 # Responsive Celendar widget script
 # by w3widgets
 #
 # Author: Lukasz Kokoszkiewicz
 #
 # Copyright © w3widgets 2013 All Rights Reserved
 */


(function () {

    (function ($) {
        "use strict";
        var Calendar, opts, spy;
        Calendar = function (element, options) {
            var time;
            this.$element = element;
            this.options = options;
            this.weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            this.nepali = this.options.nepali || false;
            this.time = new Date();
            if (this.options.time) {
                time = this.splitDateString(this.options.time);
                this.currentYear = time.year;
                this.currentMonth = time.month;
                this.currentDay = time.day;
            } else {
                this.nepaliCalendarData = {};
                this.currentYear = this.time.getFullYear();
                this.currentMonth = this.time.getMonth() + 1;
                this.currentDay = this.time.getDate();
                this.currentNepaliMonthValues = this.getNepaliMonthValues(this.time);
                this.preDraw();
            }
            this.initialDraw();
            return null;
        };
        Calendar.prototype = {
            addLeadingZero: function (num) {
                if (num < 10) {
                    return "0" + num;
                } else {
                    return "" + num;
                }
            },
            applyTransition: function ($el, transition) {
                $el.css('transition', transition);
                $el.css('-ms-transition', '-ms-' + transition);
                $el.css('-moz-transition', '-moz-' + transition);
                return $el.css('-webkit-transition', '-webkit-' + transition);
            },
            applyBackfaceVisibility: function ($el) {
                $el.css('backface-visibility', 'hidden');
                $el.css('-ms-backface-visibility', 'hidden');
                $el.css('-moz-backface-visibility', 'hidden');
                return $el.css('-webkit-backface-visibility', 'hidden');
            },
            applyTransform: function ($el, transform) {
                $el.css('transform', transform);
                $el.css('-ms-transform', transform);
                $el.css('-moz-transform', transform);
                return $el.css('-webkit-transform', transform);
            },
            splitDateString: function (dateString) {
                var day, month, time, year;
                time = dateString.split('-');
                year = parseInt(time[0]);
                month = parseInt(time[1] - 1);
                day = parseInt(time[2]);
                return time = {
                    year: year,
                    month: month,
                    day: day
                };
            },
            initialDraw: function () {
                return this.drawDays(this.currentYear, this.currentMonth, this.currentDay);
            },
            editDays: function (events) {
                var dateString, day, dayEvents, time, _results;
                _results = [];
                for (dateString in events) {
                    dayEvents = events[dateString];
                    this.options.events[dateString] = events[dateString];
                    time = this.splitDateString(dateString);
                    day = this.$element.find('[data-year="' + time.year + '"][data-month="' + (time.month + 1) + '"][data-day="' + time.day + '"]').parent('.day');
                    day.removeClass('active');
                    day.find('.badge').remove();
                    day.find('a').removeAttr('href');
                    if (this.currentMonth === time.month || this.options.activateNonCurrentMonths) {
                        _results.push(this.makeActive(day, dayEvents));
                    } else {
                        _results.push(void 0);
                    }
                }
                return _results;
            },
            clearDays: function (days) {
                var dateString, day, time, _i, _len, _results;
                _results = [];
                for (_i = 0, _len = days.length; _i < _len; _i++) {
                    dateString = days[_i];
                    delete this.options.events[dateString];
                    time = this.splitDateString(dateString);
                    day = this.$element.find('[data-year="' + time.year + '"][data-month="' + (time.month + 1) + '"][data-day="' + time.day + '"]').parent('.day');
                    day.removeClass('active');
                    day.find('.badge').remove();
                    _results.push(day.find('a').removeAttr('href'));
                }
                return _results;
            },
            clearAll: function () {
                var day, days, i, _i, _len, _results;
                this.options.events = {};
                days = this.$element.find('[data-group="days"] .day');
                _results = [];
                for (i = _i = 0, _len = days.length; _i < _len; i = ++_i) {
                    day = days[i];
                    $(day).removeClass('active');
                    $(day).find('.badge').remove();
                    _results.push($(day).find('a').removeAttr('href'));
                }
                return _results;
            },
            setMonth: function (dateString) {
                var time;
                time = this.splitDateString(dateString);
                return this.currentMonth = this.drawDays(time.year, time.month, time.day);
            },
            prev: function () {
                if (!this.nepali) {
                    if (this.currentMonth - 1 < 0) {
                        this.currentYear = this.currentYear - 1;
                        this.currentMonth = 11;
                    } else {
                        this.currentMonth = this.currentMonth - 1;
                    }
                } else {
                    //using 5 days before start day of current month; 5 is just a choice can be 1 as well
                    var prevMonthDay = (moment(this.currentNepaliMonthValues.startDate).add('d', -15)).toDate();
                    this.currentYear = prevMonthDay.getFullYear();
                    this.currentMonth = prevMonthDay.getMonth();
                    this.currentDay = prevMonthDay.getDay();
                    //console.log("nepali val - next");
                    this.currentNepaliMonthValues = this.getNepaliMonthValues(prevMonthDay);
                }

                this.drawDays(this.currentYear, this.currentMonth, this.currentDay);
                if (this.options.onMonthChange) {
                    this.options.onMonthChange.call(this);
                }
                return null;
            },
            next: function () {
                if (!this.nepali) {
                    if (this.currentMonth + 1 > 11) {
                        this.currentYear = this.currentYear + 1;
                        this.currentMonth = 0;
                    } else {
                        this.currentMonth = this.currentMonth + 1;
                    }
                    this.drawDays(this.currentYear, this.currentMonth);
                } else {
                    //using 5 days after last day of current month; 5 is just a choice can be 1 as well
                    //console.log("Before nepali month vals: " + JSON.stringify(this.currentNepaliMonthValues));
                    var nextMonthDay = (moment(this.currentNepaliMonthValues.endDate).add('d', 15)).toDate();
                    this.currentYear = nextMonthDay.getFullYear();
                    this.currentMonth = nextMonthDay.getMonth();
                    this.currentDay = nextMonthDay.getDay();
                    //console.log("nepali val - next");
                    this.currentNepaliMonthValues = this.getNepaliMonthValues(nextMonthDay);
                    //console.log("After nepali month vals: " + JSON.stringify(this.currentNepaliMonthValues));
                }

                this.drawDays(this.currentYear, this.currentMonth, this.currentDay);
                if (this.options.onMonthChange) {
                    this.options.onMonthChange.call(this);
                }
                return null;
            },
            addOthers: function (day, dayEvents) {
                var badge, header, footer;
                //console.log("addOthers: " + JSON.stringify(dayEvents));
                if (typeof dayEvents === "object") {
                    if (dayEvents.number != null) {
                        badge = $("<span></span>").html(dayEvents.number).addClass("badge");
                        $(badge).addClass("badge-top");
                        if (dayEvents.badgeClass != null) {
                            badge.addClass(dayEvents.badgeClass);
                        }
                        day.append(badge);
                    }
                    if (dayEvents.utcDay != null) {
                        badge = $("<span></span>").html(dayEvents.utcDay).addClass("badge");
                        $(badge).addClass("badge-bottom");
                        if (dayEvents.utcClass != null) {
                            badge.addClass(dayEvents.utcClass);
                        }
                        day.append(badge);
                    }
                    if (dayEvents.header != null) {
                        if ((dayEvents.header[0] != null) && (dayEvents.header[0][0] != null)) {
                            //allowing hook to not show some headers in calendar
                            if (!(dayEvents.header[2] == false)) {
                                header = $("<span></span>").html(dayEvents.header[0][0]).addClass("badge");
                                $(header).addClass("badge-top-center");
                                if (dayEvents.headerClass != null) {
                                    badge.addClass(dayEvents.headerClass);
                                }
                                day.append(header);
                                // add holiday class if needed
                                if (dayEvents.header[1] == true) {
                                    day.addClass("holiday");
                                    if (dayEvents.holidayClass != null) {
                                        badge.addClass(dayEvents.holidayClass);
                                    }
                                }
                            }
                        }
                    }
                    if (dayEvents.footer != null) {
                        footer = $("<span></span>").html(this.options.nepaliTeethiStr[dayEvents.footer]).addClass("badge");
                        $(footer).addClass("badge-bottom-center");
                        if (dayEvents.footerClass != null) {
                            badge.addClass(dayEvents.footerClass);
                        }
                        day.append(footer);
                    }
                    if (dayEvents.url) {
                        day.find("a").attr("href", dayEvents.url);
                    }
                }
                return day;
            },
            makeActive: function (day, dayEvents) {
                var classes, eventClass, i, _i, _len;
                //console.log("makeActive: " + JSON.stringify(dayEvents));
                if (dayEvents) {
                    if (dayEvents["class"]) {
                        classes = dayEvents["class"].split(" ");
                        for (i = _i = 0, _len = classes.length; _i < _len; i = ++_i) {
                            eventClass = classes[i];
                            day.addClass(eventClass);
                        }
                    } else if (!this.nepali) {
                        day.addClass("active");
                    }
                    day = this.addOthers(day, dayEvents);
                }
                return day;
            },
            getDaysInMonth: function (year, month) {
                return new Date(year, month + 1, 0).getDate();
            },
            getNepaliMonthValues: function(date) {
                var year, month = 0, advCounter = 0, prevCounter = 0, newYearDt, dateMoment = moment(date), nepaliMonthValues = {}, nepaliMonthsDays, diff;

                // Get UTC year and add 57 to it to calculate nepali year based on first day of year for this date
                year = date.getFullYear() + 57;
                //console.log("Nepali year: " + date + ";" + nepaliMonthValues.year);
                //load data for current year, previous year and next year if not present in data
                for (var idx = (year-1); idx <= (year+1); idx++) {
                    if (this.nepaliCalendarData[idx] == undefined) {
                        //load state selection options
                        $.ajax({
                            url: this.options.getDataUrl(idx),
                            dataType: "json",
                            context: this,
                            async : false
                        }).done(function(data) {
                            if ((data != null) && (data[idx] != null)) {
                                try {
                                    this.nepaliCalendarData[idx] = data[idx];
                                    this.nepaliCalendarData[idx].newYearUtc = (moment(data[idx].newYearUtcJson, 'YYYY-MM-DD')).toDate();
                                    //console.log("New year date for " + idx + " is " + this.nepaliCalendarData[idx].newYearUtc);
                                } catch (ex) {
                                    console.log("Exception setting data for year " + idx + " : " + ex);
                                }
                            } else {
                                console.log("No calendar data for year: " + idx);
                            }
                        }).fail(function(jqXhr, textStatus, error) {
                            console.log("Error load data for year " + idx + " : " + error);
                        });
                    }
                }

                nepaliMonthValues.year = year;
                newYearDt =  this.nepaliCalendarData[nepaliMonthValues.year].newYearUtc;
                diff = dateMoment.diff(moment(newYearDt), 'd');
                //console.log("Diff from new year: " + nepaliMonthValues.year + "; " + diff);
                if (diff < 0) {
                    // Date is 56 years ahead instead of 57
                    nepaliMonthValues.year--;
                    newYearDt =  this.nepaliCalendarData[nepaliMonthValues.year].newYearUtc;
                }

                // Evaluate nepali month
                nepaliMonthsDays = this.nepaliCalendarData[nepaliMonthValues.year].days;
                diff = dateMoment.diff(moment(newYearDt), 'd');//Ext.Date.diff(utcYrStartDate, Ext.Date.clearTime(date), Ext.Date.DAY) + 1;
                for (var i=0; i<12; i++) {
                    advCounter += nepaliMonthsDays[i];
                    if (advCounter >= diff) {
                        break;
                    } else {
                        month++;
                        prevCounter += nepaliMonthsDays[i];
                    }
                }
                nepaliMonthValues.month = month;
                if(month < 1) {
                    nepaliMonthValues.prevMonthDays = this.nepaliCalendarData[nepaliMonthValues.year-1].days[11];
                } else {
                    nepaliMonthValues.prevMonthDays = this.nepaliCalendarData[nepaliMonthValues.year].days[month-1];
                }
                //console.log("Calc values: diff=" + diff + "; advCounter=" + advCounter + "; prevCounter=" + prevCounter);

                // Evaluate dates
                nepaliMonthValues.startDate = (moment(newYearDt).add('d', prevCounter)).toDate();
                nepaliMonthValues.startDate.setHours(0,0,0,0);
                nepaliMonthValues.endDate = ((moment(newYearDt).add('d', advCounter > 0 ? advCounter - 1 : advCounter))).toDate();
                nepaliMonthValues.endDate.setHours(0,0,0,0);
                nepaliMonthValues.nepaliDate = dateMoment.diff(moment(nepaliMonthValues.startDate), 'd') + 1;

                console.log("Nepali date values for " + date + " : " + JSON.stringify(nepaliMonthValues));
                return nepaliMonthValues;

            },
            convertToNepaliNumber: function(num) {
                if (isNaN(num)) {
                    return "";
                } else {
                    var numStr = (num + "").trim(), numNep = "", i;
                    for (i = 0; i < numStr.length; i++) {
                        numNep += "" + this.options.nepaliNumbers[parseInt(numStr.charAt(i))];
                    }
                    return numNep;
                }
            },
            preDraw: function() {
                // set today active=
                //var todaySelector = '[data-day="' + this.currentDay + '"][data-month="' + this.currentMonth + '"][data-year="' + this.currentYear + '"]';
                //console.log("finding: " + todaySelector);
                //var today = this.$element.find(todaySelector);
                //console.log("today:" + $(today).html());
                //today.addClass("active");
                //set month text
                if (this.nepali) {
                    var prevMonth = (this.currentNepaliMonthValues.month == 0) ? this.options.nepaliMonths[11] :
                        this.options.nepaliMonths[this.currentNepaliMonthValues.month-1];
                    var nextMonth = (this.currentNepaliMonthValues.month == 11) ? this.options.nepaliMonths[0] :
                        this.options.nepaliMonths[this.currentNepaliMonthValues.month+1];
                    this.$element.find("[data-go='prev']").children("div").html("<span class=\"glyphicon glyphicon-step-backward\"></span> " + prevMonth);
                    this.$element.find("[data-go='next']").children("div").html(nextMonth + " <span class=\"glyphicon glyphicon-step-forward\"></span>");
                }
            },
            drawDay: function (lastDayOfMonth, yearNum, monthNum, dayNum, i, localeDtVals) {
                //console.log("drawDay: localeDtVals=" + JSON.stringify(localeDtVals) + ";dayNum=" + dayNum + "; i=" + i);
                var calcDate, dateNow, dateString, day, dayDate, pastFutureClass, localeDate, footerData, headerData;
                day = $("<div></div>").addClass("day");
                dateNow = new Date();
                dateNow.setHours(0, 0, 0, 0);

                if (this.nepali) {
                    //console.log("Before converted dayNum=" + dayNum + "; i=" + i);
                    dayDate = (moment(localeDtVals.startDate).add('d', dayNum - 2)).toDate();
                    //calculate miti
                    if (dayDate.getTime() < localeDtVals.startDate.getTime()) {
                        localeDate = localeDtVals.prevMonthDays + dayNum - 1;
                        // go to previous year for first month
                        if (localeDtVals.month > 0) {
                            footerData = this.nepaliCalendarData[localeDtVals.year].teethi[localeDtVals.month];
                            headerData = this.nepaliCalendarData[localeDtVals.year].parva[localeDtVals.month + "-" + localeDate];
                        } else {
                            footerData = this.nepaliCalendarData[localeDtVals.year-1].teethi[12];
                            headerData = this.nepaliCalendarData[localeDtVals.year].parva["12-" + localeDate];
                        }
                        console.log("previous month data for year=" + localeDtVals.year + "; month=" + localeDtVals.month);
                    } else if (dayDate.getTime() > localeDtVals.endDate.getTime()) {
                        localeDate = (moment(dayDate).diff(moment(localeDtVals.endDate), 'd'));
                        // go to next year for last month
                        if (localeDtVals.month < 11) {
                            footerData = this.nepaliCalendarData[localeDtVals.year].teethi[localeDtVals.month+ 2];
                            headerData = this.nepaliCalendarData[localeDtVals.year].parva[(localeDtVals.month+2) + "-" + localeDate];
                        } else {
                            footerData = this.nepaliCalendarData[localeDtVals.year+1].teethi[1];
                            headerData = this.nepaliCalendarData[localeDtVals.year].parva["1-" + localeDate];
                        }
                        console.log("next month data for year=" + localeDtVals.year + "; month=" + localeDtVals.month);
                    } else {
                        localeDate = (moment(dayDate).diff(moment(localeDtVals.startDate), 'd')) + 1;
                        //console.log("year data for year=" + localeDtVals.year + "; month=" + localeDtVals.month + " : "
                        //    + JSON.stringify(this.nepaliCalendarData[localeDtVals.year].teethi[localeDtVals.month + 1]))
                        footerData = this.nepaliCalendarData[localeDtVals.year].teethi[localeDtVals.month+ 1];
                        headerData = this.nepaliCalendarData[localeDtVals.year].parva[(localeDtVals.month+1) + "-" + localeDate];
                    }
                    yearNum = dayDate.getFullYear();
                    monthNum = dayDate.getMonth();
                    dayNum = dayDate.getDate();

                    dateString = yearNum + "-" + this.addLeadingZero(monthNum) + "-" + this.addLeadingZero(dayNum);
                    //localeDate = dayNum;
                    this.options.events[dateString] = {};
                    this.options.events[dateString].utcDay = dayNum;
                    this.options.events[dateString].footer = footerData[localeDate-1];
                    this.options.events[dateString].header = headerData;
                    //console.log("After converted date: " + dayDate + ";dayNum=" + dayNum + "; i=" + i + "; localeDate=" + localeDate);
                } else {
                    dayDate = new Date(yearNum, monthNum - 1, dayNum);
                    dateString = yearNum + "-" + this.addLeadingZero(monthNum) + "-" + this.addLeadingZero(dayNum);
                }
                dayDate.setHours(0, 0, 0, 0);

                if (dayDate.getTime() < dateNow.getTime()) {
                    pastFutureClass = "past";
                } else if (dayDate.getTime() === dateNow.getTime()) {
                    pastFutureClass = "today";
                } else {
                    pastFutureClass = "future";
                }
                day.addClass(this.weekDays[i % 7]);
                day.addClass(pastFutureClass);

                var isCurrent = (this.nepali) ? (dayDate.getTime() >= localeDtVals.startDate.getTime()) &&  (dayDate.getTime() <= localeDtVals.endDate.getTime())
                                                : dayNum <= 0 || dayNum > lastDayOfMonth ;
                if (!isCurrent) {
                    calcDate = new Date(yearNum, monthNum - 1, dayNum);
                    dayNum = calcDate.getDate();
                    monthNum = calcDate.getMonth() + 1;
                    yearNum = calcDate.getFullYear();
                    day.addClass("not-current").addClass(pastFutureClass);
                    if (this.options.activateNonCurrentMonths) {
                        dateString = yearNum + "-" + this.addLeadingZero(monthNum) + "-" + this.addLeadingZero(dayNum);
                    }
                }
                //console.log("Day Append: " + this.convertToNepaliNumber(localeDate));
                day.append($("<a>" + (this.nepali ? this.convertToNepaliNumber(localeDate) : dayNum) + "</a>").attr("data-day", dayNum).attr("data-month", monthNum).attr("data-year", yearNum));

                if (this.options.monthChangeAnimation) {
                    this.applyTransform(day, 'rotateY(180deg)');
                    this.applyBackfaceVisibility(day);
                }
                //if (localeDate == 7) {
                //    console.log("Day HTML: " + $(day).html() + "; dateString=" + dateString);
                //}

                day = this.makeActive(day, this.options.events[dateString]);

                //if (this.options.events[dateString]) {
                //    console.log("Day HTML: " + $(day).html() + ";" + JSON.stringify(this.options.events[dateString]));
                //}

                return this.$element.find('[data-group="days"]').append(day);
            },
            drawDays: function (year, month, date) {
                //console.log("drawDays: " + year + "; month: " + month + "; date=" + date);
                var currentMonth, day, dayBase, days, delay, draw, firstDayOfMonth, i, lastDayOfMonth, loopBase, monthNum, multiplier, thisRef, time, timeout, yearNum, localeDtVals, _i, _len;
                thisRef = this;
                time = new Date(year, month, date);
                if (this.nepali) {
                    localeDtVals = this.currentNepaliMonthValues;
                }

                currentMonth = time.getMonth();
                monthNum = time.getMonth() + 1;
                yearNum = time.getFullYear();
                time.setDate(1);
                firstDayOfMonth = this.options.startFromSunday ? time.getDay() + 1 : time.getDay() || 7;
                lastDayOfMonth = this.getDaysInMonth(year, month);
                //console.log("drawDays: currentMonth=" + currentMonth +"; monthNum=" + monthNum + "; yearNum=" + yearNum + "; time=" + time
                //            + "; firstDayOfMonth=" + firstDayOfMonth + "; lastDayOfMonth=" + lastDayOfMonth);
                timeout = 0;
                if (this.options.monthChangeAnimation) {
                    days = this.$element.find('[data-group="days"] .day');
                    for (i = _i = 0, _len = days.length; _i < _len; i = ++_i) {
                        day = days[i];
                        delay = i * 0.01;
                        this.applyTransition($(day), 'transform .5s ease ' + delay + 's');
                        this.applyTransform($(day), 'rotateY(180deg)');
                        this.applyBackfaceVisibility($(day));
                        timeout = (delay + 0.1) * 1000;
                    }
                }
                dayBase = 2;
                if (this.options.allRows) {
                    loopBase = 42;
                } else {
                    //console.log("shouldn't come here for nepali cal");
                    multiplier = Math.ceil((firstDayOfMonth - (dayBase - 1) + lastDayOfMonth) / 7);
                    loopBase = multiplier * 7;
                }
                if(this.nepali) {
                    this.$element.find("[data-head-year]").html(this.convertToNepaliNumber(localeDtVals.year));
                    this.$element.find("[data-head-month]").html(this.options.nepaliMonths[localeDtVals.month]);
                    this.$element.find("[data-head-utc-month]").html(this.options.translateMonths[localeDtVals.startDate.getMonth()] + " / "
                                        + this.options.translateMonths[localeDtVals.endDate.getMonth()] + " " + year);

                } else {
                    this.$element.find("[data-head-year]").html(year);
                    this.$element.find("[data-head-month]").html(this.options.translateMonths[time.getMonth()]);
                }
                draw = function () {
                    var dayNum, setEvents, firstDayOfMonthNum;
                    thisRef.$element.find('[data-group="days"]').empty();
                    firstDayOfMonthNum = (thisRef.nepali) ? localeDtVals.startDate.getDay() : firstDayOfMonth;
                    dayNum = dayBase - firstDayOfMonthNum;
                    i = thisRef.options.startFromSunday ? 0 : 1;

                    //("drawDay call: dayNum=" + dayNum +"; firstDayOfMonthNum=" + firstDayOfMonthNum + "; i=" + i
                     //                   + "; loopBase=" + loopBase +"; cond=" + (loopBase - firstDayOfMonthNum + dayBase));
                    while (dayNum < loopBase - firstDayOfMonthNum + dayBase) {
                        thisRef.drawDay(lastDayOfMonth, yearNum, monthNum, dayNum, i, localeDtVals);
                        dayNum = dayNum + 1;
                        i = i + 1;
                    }
                    setEvents = function () {
                        var _j, _len1;
                        days = thisRef.$element.find('[data-group="days"] .day');
                        for (i = _j = 0, _len1 = days.length; _j < _len1; i = ++_j) {
                            day = days[i];
                            thisRef.applyTransition($(day), 'transform .5s ease ' + (i * 0.01) + 's');
                            thisRef.applyTransform($(day), 'rotateY(0deg)');
                        }
                        if (thisRef.options.onDayClick) {
                            thisRef.$element.find('[data-group="days"] .day a').click(function () {
                                return thisRef.options.onDayClick.call(this, thisRef.options.events);
                            });
                        }
                        if (thisRef.options.onDayHover) {
                            thisRef.$element.find('[data-group="days"] .day a').hover(function () {
                                return thisRef.options.onDayHover.call(this, thisRef.options.events);
                            });
                        }
                        if (thisRef.options.onActiveDayClick) {
                            thisRef.$element.find('[data-group="days"] .day.active a').click(function () {
                                return thisRef.options.onActiveDayClick.call(this, thisRef.options.events);
                            });
                        }
                        if (thisRef.options.onActiveDayHover) {
                            return thisRef.$element.find('[data-group="days"] .day.active a').hover(function () {
                                return thisRef.options.onActiveDayHover.call(this, thisRef.options.events);
                            });
                        }
                    };
                    return setTimeout(setEvents, 0);
                };
                setTimeout(draw, timeout);
                return currentMonth;
            }
        };
        $.fn.responsiveCalendar = function (option, params) {
            var init, options, publicFunc;
            if (params == null) {
                params = void 0;
            }
            options = $.extend({}, $.fn.responsiveCalendar.defaults, typeof option === 'object' && option);
            publicFunc = {
                next: 'next',
                prev: 'prev',
                edit: 'editDays',
                clear: 'clearDays',
                clearAll: 'clearAll'
            };
            init = function ($this) {
                var data;
                options = $.metadata ? $.extend({}, options, $this.metadata()) : options;
                $this.data('calendar', (data = new Calendar($this, options)));
                if (options.onInit) {
                    options.onInit.call(data);
                }
                return $this.find("[data-go]").click(function () {
                    if ($(this).data("go") === "prev") {
                        data.prev();
                    }
                    if ($(this).data("go") === "next") {
                        return data.next();
                    }
                });
            };
            return this.each(function () {
                var $this, data;
                $this = $(this);
                data = $this.data('calendar');
                if (!data) {
                    init($this);
                } else if (typeof option === 'string') {
                    if (publicFunc[option] != null) {
                        data[publicFunc[option]](params);
                    } else {
                        data.setMonth(option);
                    }
                } else if (typeof option === 'number') {
                    data.jump(Math.abs(option) + 1);
                }
                return null;
            });
        };
        $.fn.responsiveCalendar.defaults = {
            translateMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            nepaliMonths: ['बैशाख', 'जेष्ठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन', 'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'],
            nepaliNumbers : ['०','१', '२', '३', '४', '५', '६', '७', '८', '९'],
            nepaliTeethiStr : [
                'औंसी', 'प्रतिपदा', 'द्वितीया', 'तृतिया', 'चतुर्थी', 'पञ्चमी', 'षष्ठी', 'सप्तमी',
                'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा'
            ],
            events: {},
            time: void 0,
            allRows: true,
            startFromSunday: false,
            activateNonCurrentMonths: false,
            monthChangeAnimation: true,
            getDataUrl: void 0,
            onInit: void 0,
            onDayClick: void 0,
            onDayHover: void 0,
            onActiveDayClick: void 0,
            onActiveDayHover: void 0,
            onMonthChange: function(){
                if(this.nepali) {
                    this.preDraw();
                }
            }
        };
        spy = $('[data-spy="responsive-calendar"]');
        if (spy.length) {
            opts = {};
            if ((spy.data('translate-months')) != null) {
                opts.translateMonths = spy.data('translate-months').split(',');
            }
            if ((spy.data('time')) != null) {
                opts.time = spy.data('time');
            }
            if ((spy.data('all-rows')) != null) {
                opts.allRows = spy.data('all-rows');
            }
            if ((spy.data('start-from-sunday')) != null) {
                opts.startFromSunday = spy.data('start-from-sunday');
            }
            if ((spy.data('activate-non-current-months')) != null) {
                opts.activateNonCurrentMonths = spy.data('activate-non-current-months');
            }
            if ((spy.data('month-change-animation')) != null) {
                opts.monthChangeAnimation = spy.data('month-change-animation');
            }
            return spy.responsiveCalendar(opts);
        }
    })(jQuery);

}).call(this);
