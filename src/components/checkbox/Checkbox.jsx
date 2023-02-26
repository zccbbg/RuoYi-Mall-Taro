import {AtIcon} from "taro-ui";
import React from "react";
import {View} from "@tarojs/components";
import './index.less';

export default class Checkbox extends React.Component {

  bindIsDefault(v) {
    this.props.onChange(v);
  }

  render() {
    const {checked, label} = this.props;
    return (
      <View className='checkbox-wrapper' onClick={this.bindIsDefault.bind(this, !checked)}>
        <View className={'check' + (checked ? ' checked' : '')}>
          {
            checked ? <AtIcon value='check' /> : ''
          }
        </View>
        {label || '设为默认地址'}
      </View>
    )
  }
}
