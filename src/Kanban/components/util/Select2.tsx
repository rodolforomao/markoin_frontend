import React, { Dispatch, useEffect, useState } from 'react';
import Select, { MultiValue, SingleValue } from 'react-select';
import Cookies from 'js-cookie';
import { A, T } from '../issue/CreateIssueModal';
import { capitalizeFirstLetterOfWords } from '../../../utils/UpperCase';

type Category = { text: string; value: number };

type Prop = {
    list: Category[];
    type: 'normal' | 'multiple';
    variant?: 'normal' | 'small';
    defaultValue?: number | Category[];
    onChange?: (index: number) => void;
    dispatch?: Dispatch<A>;
    actionType: T;
    className?: string;
    cookieName?: string;
    sortList?: boolean;
    identityText?: boolean;
};

const Select2 = (props: Prop) => {
    const {
        list,
        defaultValue: dv,
        type,
        dispatch,
        actionType,
        className,
        cookieName,
        sortList = false,
        identityText = false,
    } = props;

    let transformedList = list;

    if (identityText) {
        transformedList = transformedList.map(item => ({
            ...item,
            text: capitalizeFirstLetterOfWords(item.text)
        }));
    }

    if (sortList) {
        transformedList = [...transformedList].sort((a, b) => a.text.localeCompare(b.text));
    }

    const isMulti = type === 'multiple';

    const savedValue = cookieName ? Cookies.get(cookieName) : null;

    const [current, setCurrent] = useState<Category[] | number>(
        savedValue ? JSON.parse(savedValue) : dv || (isMulti ? [transformedList[0]] : 0)
    );

    useEffect(() => {
        if (cookieName) {
            Cookies.set(cookieName, JSON.stringify(current));
        }
    }, [current, cookieName]);

    useEffect(() => {
        if (!dispatch || dv !== undefined || transformedList.length === 0) return;
        const initialValue = transformedList[0].value;
        dispatch({
            type: actionType,
            value: isMulti ? [initialValue] : initialValue,
        });
    }, [dispatch, actionType, isMulti, dv, transformedList]);

    const handleChange = (selectedOption: SingleValue<Category> | MultiValue<Category>) => {
        if (isMulti) {
            const multiValues = selectedOption as MultiValue<Category>;
            const mutableMultiValues = [...multiValues];  // Convert readonly array to mutable array
            setCurrent(mutableMultiValues);
            if (dispatch) {
                dispatch({ type: actionType, value: mutableMultiValues.map(item => item.value) });
            }
        } else {
            const singleValue = selectedOption as SingleValue<Category>;
            setCurrent((singleValue as Category).value);
            if (dispatch) {
                dispatch({ type: actionType, value: (singleValue as Category).value });
            }
        }
    };

    const getCurrentOption = () => {
        if (isMulti) {
            return current as Category[];
        } else {
            return transformedList.find(item => item.value === (current as number));
        }
    };

    return (
        <Select
            options={transformedList}
            isMulti={isMulti}
            className={className}
            value={getCurrentOption()}
            onChange={handleChange}
            getOptionLabel={(option: Category) => option.text}
            getOptionValue={(option: Category) => option.value.toString()}
        />
    );
}

export default Select2;