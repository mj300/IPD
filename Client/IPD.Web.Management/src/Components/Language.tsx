import React from 'react';
import { DropdownInput } from 'twomj-components-react';
import { LanguageList } from '../CoreFiles/AppConst';
import { GetCurrentLang, themeIsDark } from '../CoreFiles/AppFunc';


export const Language = (props: IProps) => {
   return (<DropdownInput className="langStyle"
      list={LanguageList} selectedValue={LanguageList.find(l => l.value == GetCurrentLang())!.name}
      onChange={(select) => {
         let language = LanguageList.find(l => l.name == select.name)!.value;
         let lang = language.split("-")[0];
         props.onChange(lang);
         localStorage.setItem('Language', language);
      }} />);

};

declare type IProps = {
   onChange: (value: string) => void;
};