/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import BEMHelper from "react-bem-helper";
import "./InserWord.css";

import { DefinitionData, defaultData } from "../../models/DefinitionData";
import { Searchbar } from "./Searchbar";
import { Definition } from "./Definition/Definition";
import { compareStrings } from "../../utils/stringUtils";
import { useRecoilState } from "recoil";
import { definitionsState, searchedDefinitionState } from "../../store/atoms";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { getData } from "../../utils/getData";

const classes = new BEMHelper({
  name: "insert-page",
});

export const InsertWord = () => {
  const [definition, setDefinition] = useRecoilState(searchedDefinitionState);
  const [definitions, setDefinitions] = useRecoilState(definitionsState);
  const [param, setParam] = useState("");
  const { word } = useParams<{ word: string }>();
  const { push } = useHistory();
  const location = useLocation();

  useEffect(() => {
    setDefinitions(getData().filter((definition) => !!definition));
  }, []);

  useEffect(() => {
    if (word) setParam(word);
  }, [word]);

  useEffect(() => {
    if (param) {
      search(param);
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
      return compareStrings(def.slovo, input);
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
        words={definitions.map((definition) => definition.slovo)}
        onClose={() => push("/insert")}
      />
      {(definition.id !== -1 || definition === undefined) && <Definition definition={definition} />}
    </div>
  );
};
