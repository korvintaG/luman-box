import { FC } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { RecordsList } from "../../../../shared/components/RecordsList"; 
import { useKeywordsList, useKeywordsListRes } from "../../hooks/use-keywords-list";
import { genKeywordsByClassURL, genKeywordURL } from "../../../../app/router/navigation";
import { getVerificationClass } from "../../../../shared/CSS/CSS-utils";
import { Breadcrumbs, BreadcrumbContent, Breadcrumb, BreadcrumbSimpeType } from "../../../../shared/components/Breadcrumbs/Breadcrumbs";
import { SimpleNameObject, VerificationStatus } from "../../../../shared/types/entity-types";
import style from './keyword-list.module.css'
import { ButtonUI } from "../../../../shared/ui/button";
import { KeywordListItem } from "../../types/keyword-types";

export type KeywordListUIProps = {
  hookListRes: useKeywordsListRes 
  readOnly?: boolean;
};

export const KeywordList: FC<KeywordListUIProps> = ({
  readOnly,  hookListRes
}) => {
    const {keywords, addNewKeyword, sliceState , error, fetchRecords } =  hookListRes;

    const getComplexVerificationStatus=(verification_status:VerificationStatus, names_to_moderate?:number):VerificationStatus => {
      if (names_to_moderate) 
        return VerificationStatus.ToModerate
      else
        return verification_status
    }

    if (!keywords || !keywords.current || !keywords.keywords)
        return null;
    
    // Парсим breadcrumbs из JSON и преобразуем в нужный формат
    let breadCrumbs: Breadcrumb[] = keywords.current.bread_crumbs 
      ? (JSON.parse(keywords.current.bread_crumbs) as SimpleNameObject[]).map(item => ({
          name: item.name,
          path: genKeywordsByClassURL(item.id)
        }))
      : [];

    if (keywords.current.name)
      breadCrumbs.unshift(BreadcrumbSimpeType.KeywordsList);
  
  return (<section className={style.section}>
       {breadCrumbs.length > 0 && <Breadcrumbs
          breadcrumbElementTypes={breadCrumbs} 
       />}
        <div className={style.body}>
          <h1>{keywords.current.name?
              <Link 
                to={genKeywordURL(keywords.current.id)}
                className={getVerificationClass(
                  getComplexVerificationStatus(
                    keywords.current.verification_status ?? VerificationStatus.Creating,
                    keywords.current.names_to_moderate
                  ))}          
                data-cy="keyword_link_detail"
                >{keywords.current.name}
              </Link>
              :'Ключевые слова'}
          </h1>
          <ul className={style.list} data-cy="records-list">
            <li className={style.definition}>{keywords.current.definition}</li>
            {keywords.keywords.map((keyword, index) => (
              <li 
                key={keyword.id} 
                data-cy={`keyword_list_${index}`}
                className={style.keyword_li}
                >
                <Link
                  to={genKeywordsByClassURL(keyword.id)}
                  data-cy={`keyword_link_${index}`}
                  className={getVerificationClass(
                    getComplexVerificationStatus(keyword.verification_status, keyword.names_to_moderate))}
                >
                  {keyword.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {!readOnly 
          && hookListRes.keywords 
          && hookListRes.keywords.current.verification_status!==VerificationStatus.Rejected 
          && <ButtonUI
          logicType="add"
          onClick={addNewKeyword}
          caption="Добавить ключевое слово"
          data-cy="add-record-button"
        />}
      </section> 
  );
};
//            className={clsx({ "moderated-need": !keyword.moderated })}
