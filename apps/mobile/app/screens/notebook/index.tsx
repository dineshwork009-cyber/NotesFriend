import { resolveItems } from "@notesfriend/common";
import { Note, Notebook, VirtualizedGrouping } from "@notesfriend/core";
import { strings } from "@notesfriend/intl";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../../common/database";
import { FloatingButton } from "../../components/container/floating-button";
import DelayLayout from "../../components/delay-layout";
import { Header } from "../../components/header";
import List from "../../components/list";
import { NotebookHeader } from "../../components/list-items/headers/notebook-header";
import { Properties } from "../../components/properties";
import SelectionHeader from "../../components/selection-header";
import { useNavigationFocus } from "../../hooks/use-navigation-focus";
import { eSendEvent, eSubscribeEvent } from "../../services/event-manager";
import Navigation, { NavigationProps } from "../../services/navigation";
import useNavigationStore, {
  NotebookScreenParams
} from "../../stores/use-navigation-store";
import { eUpdateNotebookRoute } from "../../utils/events";
import { findRootNotebookId } from "../../utils/notebooks";
import { openEditor, setOnFirstSave } from "../notes/common";
import { View } from "react-native";
import { Notebooks } from "../../components/sheets/notebooks";
import { useSettingStore } from "../../stores/use-setting-store";
import { rootNavigatorRef } from "../../utils/global-refs";

const NotebookScreen = ({ route, navigation }: NavigationProps<"Notebook">) => {
  const [notes, setNotes] = useState<VirtualizedGrouping<Note>>();
  const params = useRef<NotebookScreenParams>(route?.params);
  const isAppLoading = useSettingStore((state) => state.isAppLoading);
  const [notebook, setNotebook] = useState<Notebook | undefined>(
    params.current.item
  );
  const [loading, setLoading] = useState(true);
  const updateOnFocus = useRef(false);
  const [breadcrumbs, setBreadcrumbs] = useState<
    {
      id: string;
      title: string;
    }[]
  >([]);

  useNavigationFocus(navigation, {
    onFocus: () => {
      if (updateOnFocus.current) {
        onRequestUpdate();
        updateOnFocus.current = false;
      } else {
        Navigation.routeNeedsUpdate(route.name, onRequestUpdate);
      }
      syncWithNavigation();
      return false;
    },
    onBlur: () => {
      updateOnFocus.current = false;
      setOnFirstSave(null);
      return false;
    }
  });

  const syncWithNavigation = React.useCallback(() => {
    useNavigationStore.getState().setFocusedRouteId(params?.current?.id);
    setOnFirstSave({
      type: "notebook",
      id: params.current.id
    });
  }, []);

  const onRequestUpdate = React.useCallback(
    async (data?: NotebookScreenParams) => {
      if (useSettingStore.getState().isAppLoading) return;
      if (
        useNavigationStore.getState().focusedRouteId !== params.current.id &&
        !data
      ) {
        updateOnFocus.current = true;
        return;
      }

      if (data?.id && params.current?.id !== data?.id) {
        const nextRootNotebookId = await findRootNotebookId(data?.id);
        const currentNotebookRoot = await findRootNotebookId(params.current.id);

        if (
          nextRootNotebookId !== currentNotebookRoot ||
          nextRootNotebookId === params.current?.id
        ) {
          // Never update notebook in route if root is different or if the root is current notebook.
          return;
        }
      }

      if (data) params.current = data;

      try {
        const notebook = await db.notebooks?.notebook(params?.current?.id);
        setNotebook(notebook);
        params.current.item = notebook;
        if (notebook) {
          const breadcrumbs = await db.notebooks.breadcrumbs(notebook.id);
          setBreadcrumbs(breadcrumbs.slice(0, breadcrumbs.length - 1));
          params.current.id = notebook.id;
          const notes = await db.relations
            .from(notebook, "note")
            .selector.grouped(db.settings.getGroupOptions("notes"));
          setNotes(notes);
          await notes.item(0, resolveItems);
          syncWithNavigation();
        } else {
          if (rootNavigatorRef.canGoBack()) {
            Navigation.goBack();
          } else {
            Navigation.navigate("Notes");
          }
        }
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    },
    [syncWithNavigation]
  );

  useEffect(() => {
    if (isAppLoading) return;
    onRequestUpdate(params.current);
    const sub = eSubscribeEvent(eUpdateNotebookRoute, onRequestUpdate);
    return () => {
      sub?.unsubscribe();
    };
  }, [onRequestUpdate, isAppLoading]);

  useEffect(() => {
    return () => {
      setOnFirstSave(null);
    };
  }, []);

  return (
    <>
      <Header
        renderedInRoute={route.name}
        title={notebook?.title}
        canGoBack={params?.current?.canGoBack}
        rightButton={{
          name: "dots-vertical",
          onPress: () => {
            Properties.present(notebook);
          }
        }}
        hasSearch={true}
        onSearch={() => {
          if (!notebook) return;
          const selector = db.relations.from(notebook, "note").selector;
          Navigation.push("Search", {
            placeholder: strings.searchInRoute(notebook?.title),
            type: "note",
            title: notebook?.title,
            route: route.name,
            items: selector
          });
        }}
        id={notebook?.id}
      />

      <DelayLayout wait={loading}>
        <List
          data={notes}
          dataType="note"
          onRefresh={() => {
            onRequestUpdate();
          }}
          id={params.current?.id}
          renderedInRoute="Notebook"
          headerTitle={notebook?.title}
          loading={loading}
          CustomLisHeader={
            notebook ? (
              <NotebookHeader
                breadcrumbs={breadcrumbs}
                notebook={notebook}
                totalNotes={notes?.placeholders.length || 0}
              />
            ) : undefined
          }
          placeholder={{
            title: notebook?.title!,
            paragraph: strings.notesEmpty(),
            button: strings.addFirstNote(),
            action: openEditor,
            loading: strings.loadingNotes()
          }}
        />
      </DelayLayout>
      <View
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          alignItems: "center"
        }}
      >
        <FloatingButton
          icon="file-tree"
          testID="notebookTreeSheet"
          size="small"
          onPress={() => {
            if (!notebook) return;
            Notebooks.present(notebook);
          }}
          style={{
            position: "relative",
            right: 0,
            bottom: 0,
            paddingBottom: 10
          }}
        />
        <FloatingButton
          onPress={openEditor}
          alwaysVisible
          style={{
            position: "relative",
            paddingTop: 10,
            right: 0,
            bottom: 0
          }}
        />
      </View>
      <SelectionHeader
        id={route.params?.id}
        items={notes}
        type="note"
        renderedInRoute="Notebook"
      />
    </>
  );
};

NotebookScreen.navigate = async (item: Notebook, canGoBack?: boolean) => {
  if (!item) return;
  const { currentRoute, focusedRouteId } = useNavigationStore.getState();
  if (currentRoute === "Notebooks") {
    Navigation.push("Notebook", {
      id: item.id,
      item: item,
      canGoBack
    });
  } else if (currentRoute === "Notebook") {
    if (!focusedRouteId) return;
    const rootNotebookId = await findRootNotebookId(focusedRouteId);
    const currentNotebookRoot = await findRootNotebookId(item?.id);

    if (
      (rootNotebookId === currentNotebookRoot &&
        focusedRouteId !== rootNotebookId) ||
      focusedRouteId == item?.id
    ) {
      // Update the route in place instead

      eSendEvent(eUpdateNotebookRoute, {
        id: item.id,
        canGoBack: canGoBack,
        item: item
      });
    } else {
      // Push a new route
      Navigation.push("Notebook", {
        id: item.id,
        canGoBack,
        item: item
      });
    }
  } else {
    // Push a new route anyways
    Navigation.push("Notebook", {
      id: item.id,
      canGoBack,
      item: item
    });
  }
};

export default NotebookScreen;
