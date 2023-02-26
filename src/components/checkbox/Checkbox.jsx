import {AtCheckbox, AtIcon} from "taro-ui";
import React from "react";
import {View} from "@tarojs/components";
import './index.less';

export default class Checkbox extends React.Component {

  bindIsDefault(v) {
    this.props.onChange(v.includes('default'));
  }

  render() {
    const {checked, label} = this.props;
    const checkboxOption = [{value: 'default', label: label || '设为默认地址'}];
    const checkedList = checked ? ['default'] : [];
    return (
      <View className='checkbox-wrapper'>
        <View className='check'>
          {
            checked ? <AtIcon value='check' /> : ''
          }
        </View>
        {label || '设为默认地址'}
      </View>
    )
  }
}
