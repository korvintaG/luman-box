import FolderSlave from "../ui/icons/folder-slave/folder-slave"; 
import MosaicLamp from "../ui/icons/mosaic-lamp/mosaic-lamp"; 
import { InterconnectionTypeInfo,  InterconnestionPosition } from "../../features/interconnections/InterconnectionTypes"; 

export const interconnectionsTypeInfo:InterconnectionTypeInfo[]=[
    {
      id:3,
      hintFromIdea:'К списку связанных обобщающих или детализирующих идей',
      countPosition: InterconnestionPosition.topLeftBottomCenter,
      name: 'Иерархия',
      name1_many: 'Родительские идеи',
      name1_one: 'Родительская идея',
      name2_many: 'Дочерние идеи',
      name2_one: 'Дочерняя идея',
      icon: FolderSlave,
      //isIconCntReverce: true
    },
    {
      id:5,
      hintFromIdea:'К списку связанных решающих или решаемых идей',
      countPosition: InterconnestionPosition.topLeftBottomRight,
      name: 'Решение проблемы',
      name1_many: 'Проблемы, которые решает текущая идея',
      name1_one: 'Является проблемой',
      name2_many: 'Решения проблемы текущей идеи',
      name2_one: 'Является решением проблемы',
      icon: MosaicLamp,
      //isIconCntReverce: false
    }
  ];
  
  