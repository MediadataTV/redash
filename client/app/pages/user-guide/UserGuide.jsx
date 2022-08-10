import { map } from "lodash";
import React, { useEffect, useState } from "react";
import routeWithUserSession from "@/components/ApplicationArea/routeWithUserSession";
import PageHeader from "@/components/PageHeader";
import * as Sidebar from "@/components/items-list/components/Sidebar";
import Layout from "@/components/layouts/ContentWithSidebar";
import routes from "@/services/routes";

import "./UserGuide.less";
import MarkdownPage from "./components/MarkdownPage";

const sidebarMenu = [
  {
    key: 'userguide.querying',
    href: '#',
    title: 'Quering',
    children: [
      {
        key: "userguide.querying.writing",
        href: "/user-guide/querying/writing-queries",
        source: 'querying/writing-queries.md',
        title: "Creating and Editing Queries",
      },
      {
        key: "userguide.querying.results",
        href: "/user-guide/querying/query-results-data-source",
        source: 'querying/query-results-data-source.md',
        title: "Querying Existing Query Results",
      },
      {
        key: "userguide.querying.parameters",
        href: "/user-guide/querying/query-parameters",
        source: 'querying/query-parameters.md',
        title: "Query Parameters",
      },
      {
        key: "userguide.querying.scheduling",
        href: "/user-guide/querying/scheduling-a-query",
        source: 'querying/scheduling-a-query.md',
        title: "How to schedule a query",
      },
      {
        key: "userguide.querying.favorites",
        href: "/user-guide/querying/favorites-tagging",
        source: 'querying/favorites-tagging.md',
        title: "Favorites & Tagging",
      },
      {
        key: "userguide.querying.download",
        href: "/user-guide/querying/download-query-results",
        source: 'querying/download-query-results.md',
        title: "How To Download / Export Query Results",
      },
      {
        key: "userguide.querying.filters",
        href: "/user-guide/querying/query-filters",
        source: 'querying/query-filters.md',
        title: "Query Filters",
      },
      {
        key: "userguide.querying.snippets",
        href: "/user-guide/querying/query-snippets",
        source: 'querying/query-snippets.md',
        title: "Query Snippets",
      },
    ],
  },
  {
    key: 'userguide.visualizations',
    href: '#',
    title: 'Visualizations',
    children: [
      {
        key: "userguide.visualizations.howto",
        href: "/user-guide/visualizations/visualizations-how-to",
        source: 'visualizations/visualizations-how-to.md',
        title: "Visualizations How To",
      },
      {
        key: "userguide.visualizations.cohort",
        href: "/user-guide/visualizations/cohort-howto",
        source: 'visualizations/cohort-howto.md',
        title: "Cohort Visualizations",
      },
      {
        key: "userguide.visualizations.chart",
        href: "/user-guide/visualizations/chart-visualizations",
        source: 'visualizations/chart-visualizations.md',
        title: "Chart Visualizations",
      },
      {
        key: "userguide.visualizations.numbers",
        href: "/user-guide/visualizations/formatting-numbers",
        source: 'visualizations/formatting-numbers.md',
        title: "Formatting Numbers in Visualizations",
      },
      {
        key: "userguide.visualizations.funnel",
        href: "/user-guide/visualizations/funnel-howto",
        source: 'visualizations/funnel-chart-how-to.md',
        title: "Funnel Visualizations",
      },
      {
        key: "userguide.visualizations.pivot",
        href: "/user-guide/visualizations/pivot-table-visualizations",
        source: 'visualizations/pivot-table-visualizations.md',
        title: "How to make a pivot table",
      },
      {
        key: "userguide.visualizations.table",
        href: "/user-guide/visualizations/table-visualizations",
        source: 'visualizations/table-visualizations.md',
        title: "Table Visualization Options",
      },
      {
        key: "userguide.visualizations.types",
        href: "/user-guide/visualizations/visualization-types",
        source: 'visualizations/visualization-types.md',
        title: "Visualization Types",
      },
    ]
  },
  {
    key: 'userguide.dashboards',
    href: '#',
    title: 'Dashboards',
    children: [
      {
        key: "userguide.dashboards.editing",
        href: "/user-guide/dashboards/dashboard-editing",
        source: 'dashboards/dashboard-editing.md',
        title: "Creating and Editing Dashboards",
      },
      {
        key: "userguide.dashboards.favorites",
        href: "/user-guide/dashboards/favorites-tagging",
        source: 'dashboards/favorites-tagging.md',
        title: "Favorites & Tagging",
      },
      {
        key: "userguide.dashboards.sharing",
        href: "/user-guide/dashboards/sharing-dashboards",
        source: 'dashboards/sharing-dashboards',
        title: "Sharing and Embedding Dashboards",
      },
    ]
  }
];

export const getPage = async (page='') => {
  if(page===''){
    return '';
  }
  page='/static/user-guide/'+page;
  const resp = await fetch( page );
  const data = await resp.text();
  return data;
};


export default function UserGuide({title, page, selected, opened}) {

  const [content, setContent] = useState("");

  if(title === ''){
    title = 'User manual';
  }


  useEffect(() => {
    async function getPageContent(page) {
      const content = await getPage(page);
      setContent(content);
    }
    getPageContent(page);
  }, [page]);

  return (
    <div className="UserGuide">
      <div className="container">
        <PageHeader
          title={title}
        />
        <Layout>
          <Layout.Sidebar className="m-b-0">
            <Sidebar.Menu items={sidebarMenu} selected={selected} opened={opened} />
          </Layout.Sidebar>
          <Layout.Content>
            <MarkdownPage
            content={content} />
          </Layout.Content>
        </Layout>
      </div>
    </div>
  );
}

UserGuide.propTypes = {
  //controller: ControllerType.isRequired,
};


routes.register(
  "userguide",
  routeWithUserSession({
    path: "/user-guide",
    title: "User guide",
    render: pageProps => <UserGuide selected="userguide" />,
  })
);

// const registerMenuRoutes = (menuItems) => {
//   menuItems.forEach((item) => {
//     if(item.href !== '#'){
//       routes.register(
//         item.key,
//         routeWithUserSession({
//           path: item.href,
//           title: item.title,
//           render: pageProps => <Manual selected={item.key} page={item.source || ''} />,
//         })
//       );
//     }

//     // if(item.hasOwnProperty('children')){
//     //   registerMenuRoutes(item.children);
//     // }
//   });
// };

const registerRoutes = (menuItems, openedKeys=[]) => {
  map(menuItems, routeItem => {
    if(routeItem.href !== '#'){
      routes.register(
        routeItem.key,
        routeWithUserSession({
          path: routeItem.href,
          title: routeItem.title,
          render: pageProps => <UserGuide selected={routeItem.key} opened={openedKeys} page={routeItem.source || ''} title={routeItem.title || ''} />,
        })
      );
    }
    if(routeItem.hasOwnProperty('children')){
      registerRoutes(routeItem.children, [routeItem.key]);
    }
  });
};

registerRoutes(sidebarMenu);
