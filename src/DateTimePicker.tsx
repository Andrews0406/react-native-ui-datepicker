import React, { useEffect, useReducer } from 'react';
import utils from './utils';
import CalendarContext from './CalendarContext';
import { CalendarViews, CalendarActionKind } from './enums';
import type {
  DateType,
  CalendarModes,
  CalendarAction,
  CalendarState,
  CalendarTheme,
  HeaderProps,
} from './types';
import Calendar from './components/Calendar';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(localeData);
dayjs.extend(relativeTime);

interface PropTypes extends CalendarTheme, HeaderProps {
  value: DateType;
  mode?: CalendarModes;
  locale?: string | ILocale;
  minimumDate?: DateType;
  maximumDate?: DateType;
  onValueChange?: (value: DateType) => void;
  displayFullDays?: boolean;
}

const DateTimePicker = ({
  value,
  mode = 'datetime',
  locale = 'en',
  minimumDate = null,
  maximumDate = null,
  onValueChange = () => {},
  displayFullDays = false,
  headerButtonsPosition = 'around',
  headerContainerStyle,
  headerTextContainerStyle,
  headerTextStyle,
  headerButtonStyle,
  headerButtonColor,
  headerButtonSize,
  dayContainerStyle,
  todayContainerStyle,
  todayTextStyle,
  monthContainerStyle,
  yearContainerStyle,
  weekDaysContainerStyle,
  weekDaysTextStyle,
  calendarTextStyle,
  selectedTextStyle,
  selectedItemColor,
  timePickerContainerStyle,
  timePickerTextStyle,
  buttonPrevIcon,
  buttonNextIcon,
}: PropTypes) => {
  dayjs.locale(locale);

  const theme = {
    headerButtonsPosition,
    headerContainerStyle,
    headerTextContainerStyle,
    headerTextStyle,
    headerButtonStyle,
    headerButtonColor,
    headerButtonSize,
    dayContainerStyle,
    todayContainerStyle,
    todayTextStyle,
    monthContainerStyle,
    yearContainerStyle,
    weekDaysContainerStyle,
    weekDaysTextStyle,
    calendarTextStyle,
    selectedTextStyle,
    selectedItemColor,
    timePickerContainerStyle,
    timePickerTextStyle,
  };

  const [state, dispatch] = useReducer(
    (prevState: CalendarState, action: CalendarAction) => {
      switch (action.type) {
        case CalendarActionKind.SET_CALENDAR_VIEW:
          return {
            ...prevState,
            calendarView: action.payload,
          };
        case CalendarActionKind.CHANGE_CURRENT_DATE:
          return {
            ...prevState,
            currentDate: action.payload,
          };
        case CalendarActionKind.CHANGE_SELECTED_DATE:
          return {
            ...prevState,
            selectedDate: action.payload,
          };
      }
    },
    {
      calendarView: mode === 'time' ? CalendarViews.time : CalendarViews.day,
      selectedDate: value ? utils.getFormated(value) : utils.getNow(),
      currentDate: value ? utils.getFormated(value) : utils.getNow(),
    }
  );

  useEffect(() => {
    dispatch({
      type: CalendarActionKind.CHANGE_SELECTED_DATE,
      payload: value,
    });
    dispatch({
      type: CalendarActionKind.CHANGE_CURRENT_DATE,
      payload: value,
    });
  }, [value]);

  useEffect(() => {
    dispatch({
      type: CalendarActionKind.SET_CALENDAR_VIEW,
      payload: mode === 'time' ? CalendarViews.time : CalendarViews.day,
    });
  }, [mode]);

  const actions = {
    setCalendarView: (view: CalendarViews) =>
      dispatch({ type: CalendarActionKind.SET_CALENDAR_VIEW, payload: view }),
    onSelectDate: (date: DateType) => {
      onValueChange(date);
      dispatch({
        type: CalendarActionKind.CHANGE_SELECTED_DATE,
        payload: date,
      });
      dispatch({
        type: CalendarActionKind.CHANGE_CURRENT_DATE,
        payload: date,
      });
    },
    onSelectMonth: (month: number) => {
      const newDate = utils.getDate(state.currentDate).month(month);
      dispatch({
        type: CalendarActionKind.CHANGE_CURRENT_DATE,
        payload: utils.getFormated(newDate),
      });
      dispatch({
        type: CalendarActionKind.SET_CALENDAR_VIEW,
        payload: CalendarViews.day,
      });
    },
    onSelectYear: (year: number) => {
      const newDate = utils.getDate(state.currentDate).year(year);
      dispatch({
        type: CalendarActionKind.CHANGE_CURRENT_DATE,
        payload: utils.getFormated(newDate),
      });
      dispatch({
        type: CalendarActionKind.SET_CALENDAR_VIEW,
        payload: CalendarViews.day,
      });
    },
    onChangeMonth: (month: number) => {
      const newDate = utils.getDate(state.currentDate).add(month, 'month');
      dispatch({
        type: CalendarActionKind.CHANGE_CURRENT_DATE,
        payload: utils.getFormated(newDate),
      });
    },
    onChangeYear: (year: number) => {
      const newDate = utils.getDate(state.currentDate).add(year, 'year');
      dispatch({
        type: CalendarActionKind.CHANGE_CURRENT_DATE,
        payload: utils.getFormated(newDate),
      });
    },
  };

  return (
    <CalendarContext.Provider
      value={{
        ...state,
        ...actions,
        locale,
        mode,
        displayFullDays,
        minimumDate,
        maximumDate,
        theme,
      }}
    >
      <Calendar
        buttonPrevIcon={buttonPrevIcon}
        buttonNextIcon={buttonNextIcon}
      />
    </CalendarContext.Provider>
  );
};

export default DateTimePicker;