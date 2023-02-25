import React, {Component} from 'react';
import Taro, {getCurrentInstance} from '@tarojs/taro';
import {View, Button, Block, Input, ScrollView} from '@tarojs/components';
import {AtCheckbox} from 'taro-ui';
import * as area from '../../../utils/area';
import {showErrorToast} from '../../../utils/util';
import * as check from '../../../utils/check';
import {saveAddress, detailAddress} from '../../../services/address';

import './index.less';
import {connect} from "react-redux";

const checkboxOption = [{value: 'default', label: '设为默认地址'}];
const getDefaultSelected = () => {
  return [{
    code: 0,
    name: '省份',
  },
    {
      code: 0,
      name: '城市',
    },
    {
      code: 0,
      name: '区县',
    }
  ];
}
@connect(({user}) => {
  return {
    addressList: user.addressList
  }
})
class Index extends Component {
  $instance = getCurrentInstance()
  state = {
    address: {
      id: null,
      name: '',
      phone: '',
      address: '',
      defaultStatus: 0,
      province: '',
      city: '',
      district: '',
      areaCode: ''
    },
    openSelectRegion: false,
    selectedRegionList: getDefaultSelected(),
    // 当前选择到哪一级别行政区域了
    regionType: 0,
    // 行政区域列表
    regionList: [],
    checkedList: []
  }

  componentWillMount() {
  }

  componentDidMount() {
    // 页面初始化 options为页面跳转所带来的参数
    const {id} = this.$instance.router.params;
    if (id) {
      detailAddress({id})
        .then(res => {
          this.setState({
            address: res
          });
        })
    }
  }

  bindinputName = (event) => {
    let address = this.state.address;
    address.name = event.detail.value;
    this.setState({
      address: address
    });
  }

  bindinputMobile = (event) => {
    let address = this.state.address;
    address.phone = event.detail.value;
    this.setState({
      address: address
    });
  }

  chooseRegion = () => {
    this.setState({openSelectRegion: true});

    const {address} = this.state
    //设置区域选择数据
    const {areaCode, province, city, district } = address;
    if (areaCode) {
      const s1 = [
        {
          code: areaCode.slice(0, 2) + '0000',
          name: province,
        },
        {
          code: areaCode.slice(0, 4) + '00',
          name: city,
        },
        {
          code: areaCode,
          name: district,
        },
      ];

      let regionList = area.getList('district', areaCode.slice(0, 4));

      this.setState({
        selectedRegionList: s1,
        regionType: 2,
        regionList: regionList
      });
    } else {
      this.setState({
        selectedRegionList: getDefaultSelected(),
        regionType: 0,
        regionList: area.getList('province')
      });
    }
  }

  bindinputAddress = (event) => {
    let address = this.state.address;
    address.detailAddress = event.detail.value;
    this.setState({
      address: address
    });
  }

  bindIsDefault = (value) => {
    let address = this.state.address;
    address.defaultStatus = !address.defaultStatus;
    this.setState({
      address: address,
      checkedList: value,
    });
  }

  doneSelectRegion = () => {
    const { address, selectedRegionList } = this.state;
    address.province = selectedRegionList[0].name;
    address.city = selectedRegionList[1].name;
    address.district = selectedRegionList[2].name;
    address.areaCode = selectedRegionList[2].code;

    this.setState({
      address,
      openSelectRegion: false
    });
  }

  selectRegion = (regionItem) => {
    const { regionType, selectedRegionList } = this.state
    selectedRegionList[regionType] = regionItem;

    if (regionType === 3) {
      this.setState({
        selectedRegionList: selectedRegionList
      })
      return
    }

    const code = regionItem.code;
    let s1;
    if (regionType === 0) {
      // 点击省级，取市级
      s1 = area.getList('city', code.slice(0, 2))
    } else {
      // 点击市级，取县级
      s1 = area.getList('county', code.slice(0, 4))
    }
    this.setState({
      regionList: s1,
      selectedRegionList: selectedRegionList,
      regionType: Math.min(2, regionType + 1)
    })
  }

  cancelSelectRegion = () => {
    this.setState({
      openSelectRegion: false
    });
  }

  cancelAddress = () => {
    Taro.navigateBack();
  }
  saveAddress = () => {
    let address = this.state.address;
    if (!address.name) {
      showErrorToast('请输入姓名');
      return false;
    }
    if (!address.phone) {
      showErrorToast('请输入手机号码');
      return false;
    }
    if (!address.areaCode) {
      showErrorToast('请输入省市区');
      return false;
    }
    if (!address.detailAddress) {
      showErrorToast('请输入详细地址');
      return false;
    }
    if (!check.isValidPhone(address.phone)) {
      showErrorToast('手机号不正确');
      return false;
    }
    const { addressList } = this.props;
    saveAddress({
      id: address.id,
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      detailAddress: address.detailAddress,
      defaultStatus: addressList.length === 0 || address.defaultStatus ? 1 : 0
    }).then(res => {
      Taro.navigateBack();
      const {dispatch} = this.props;
      dispatch({type: 'user/initAddressList'});
    })
  }

  selectRegionType = (event) => {
    let regionTypeIndex = event.target.dataset.regionTypeIndex;
    console.log('regionTypeIndex', regionTypeIndex)
    let selectedRegionList = this.state.selectedRegionList;

    //判断是否可点击
    if (regionTypeIndex === this.state.regionType || (regionTypeIndex - 1 >= 0 && selectedRegionList[regionTypeIndex - 1].code <= 0)) {
      return false;
    }

    let selectRegionItem = selectedRegionList[regionTypeIndex];
    let code = selectRegionItem.code;
    let regionList;
    if (regionTypeIndex === 0) {
      // 点击省级，取省级
      regionList = area.getList('province');
    } else if (regionTypeIndex === 1) {
      // 点击市级，取市级
      regionList = area.getList('city', code.slice(0, 2));
    } else {
      // 点击县级，取县级
      regionList = area.getList('district', code.slice(0, 4));
    }
    console.log('regionList', regionList);
    regionList = regionList.map(item => {
      //标记已选择的
      if (this.state.selectedRegionList[regionTypeIndex].code == item.code) {
        item.selected = true;
      } else {
        item.selected = false;
      }
      return item;
    })

    this.setState({
      regionList: regionList,
      regionType: regionTypeIndex
    })
  }

  render() {
    const {
      address,
      openSelectRegion,
      selectedRegionList,
      regionType,
      regionList,
      checkedList
    } = this.state;
    const selectRegionDone = selectedRegionList.every(it => it.code !== 0)
    return (
      <Block>
        <View className='add-address-wrapper'>
          <View className='add-form'>
            <View className='form-item'>
              <Input className='input' onInput={this.bindinputName} placeholder='姓名' value={address.name} autoFocus />
            </View>
            <View className='form-item'>
              <Input className='input' onInput={this.bindinputMobile} value={address.phone} placeholder='手机号码' />
            </View>
            <View className='form-item'>
              <Input className='input' value={address.province + address.city + address.district} disabled
                onClick={this.chooseRegion} placeholder='省份、城市、区县'
              />
            </View>
            <View className='form-item'>
              <Input className='input' onInput={this.bindinputAddress} value={address.detailAddress}
                placeholder='详细地址, 如街道、楼盘号等'
              />
            </View>
            <View className='form-default'>
              <AtCheckbox options={checkboxOption} selectedList={checkedList} onChange={this.bindIsDefault} />
            </View>
          </View>

          <View className='btns'>
            <Button className='cannel' onClick={this.cancelAddress}>取消</Button>
            <Button className='save' onClick={this.saveAddress}>保存</Button>
          </View>

          {
            openSelectRegion && <View className='region-select'>
              <View className='hd'>
                <View className='region-selected'>
                  {
                    selectedRegionList.map((item, index) => {
                      return <View
                        className={`item ${item.code === 0 ? 'disabled' : ''} ${regionType === index ? 'selected' : ''}`}
                        onClick={() => this.selectRegionType(index)} key={index}
                      >{item.name}</View>
                    })
                  }
                </View>
                <View className={`done ${selectRegionDone ? '' : 'disabled'}`} onClick={() => {
                  if (!selectRegionDone) {
                    return;
                  }
                  this.doneSelectRegion()
                }}
                >确定</View>
              </View>
              <View className='bd'>
                <ScrollView scrollY className='region-list'>
                  {
                    regionList.map((item, index) => {
                      return <View
                        className={`item ${item.code === selectedRegionList[regionType].code ? 'selected' : ''}`}
                        onClick={() => this.selectRegion(item)}
                        key={item.code}
                      >{item.name}</View>
                    })
                  }
                </ScrollView>
              </View>
            </View>
          }
        </View>
        {
          openSelectRegion && <View className='bg-mask' onClick={this.cancelSelectRegion}></View>
        }
      </Block>
    );
  }
}

export default Index;
