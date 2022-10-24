import * as React from "react";

import type { MetaFunction } from "@remix-run/node";

import { connectors as connectorsConfig } from "~/src/components/Navbar/routes";
import { Page } from "@numaryhq/storybook";
import { useTranslation } from "react-i18next";

export const meta: MetaFunction = () => ({
  title: "Connectors",
  description: "Connectors",
});

export default function Index() {
  const { t } = useTranslation();

  return (
    <Page id={connectorsConfig.id} title={t("pages.connectors.title")}>
      {/*TODO add tab and cta !*/}
      <></>
    </Page>
  );
}
