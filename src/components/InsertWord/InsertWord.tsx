import React, { useEffect } from "react";
import BEMHelper from "react-bem-helper";
import "./InserWord.css";
import { data } from "../../utils/mapper";

import { DefinitionData, defaultData, Data } from "../../models/DefinitionData";
import { Searchbar } from "./Searchbar";
import { Definition } from "./Definition/Definition";
import { compareStrings } from "../../utils/stringUtils";
import { useRecoilState } from "recoil";
import { definitionsState, searchedDefinitionState } from "../../store/atoms";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { useLanguage } from "../../utils/useTranslation";

const classes = new BEMHelper({
  name: "insert-page",
});

const getData = (): DefinitionData[] => {
  let definitionData: DefinitionData[] = [];
  Object.entries(data).forEach(([key, value]) => {
    const dataArray = value as unknown as Data;
    definitionData = definitionData.concat(dataArray[key]);
  });
  return definitionData;
};

export const InsertWord = () => {
  const [language, setLanguage] = useLanguage();
  const [definition, setDefinition] = useRecoilState(searchedDefinitionState);
  const [definitions, setDefinitions] = useRecoilState(definitionsState);
  const { word } = useParams<{ word: string }>();
  const { push } = useHistory();
  const location = useLocation();

  useEffect(() => {
    setDefinitions(getData().filter((definition) => !!definition));
  }, []);

  useEffect(() => {
    if (word) {
      search(word);
    } else {
      setDefinition(defaultData);
    }
  }, [definitions]);

  useEffect(() => {
    if (location.pathname === "/insert") {
      setDefinition(defaultData);
    }
  }, [location]);

  const search = (input: string) => {
    const selectedDefinition = definitions.find((def: DefinitionData) => {
      return compareStrings(language === "en" ? def.hledane_slovo_EN : def.hledane_slovo, input);
    });
    if (selectedDefinition) {
      setDefinition(selectedDefinition);
      push(`/insert/${input}`);
    } else {
      setDefinition(defaultData);
      push("/insert");
    }
  };

  return (
    <div {...classes()}>
      <Searchbar
        initialWord={word ? word : undefined}
        onSearch={search}
        words={definitions.map((definition) => (language === "en" ? definition.hledane_slovo_EN : definition.hledane_slovo))}
      />
      {(definition.id !== -1 || definition === undefined) && <Definition definition={definition} />}
    </div>
  );
};
