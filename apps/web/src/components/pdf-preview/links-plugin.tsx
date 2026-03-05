import { Plugin, PluginOnAnnotationLayerRender } from "@react-pdf-viewer/core";

export function LinkPlugin(): Plugin {
  return {
    onAnnotationLayerRender: findAndReplaceLinkAnnotations
  };
}

function findAndReplaceLinkAnnotations(e: PluginOnAnnotationLayerRender) {
  e.container
    .querySelectorAll(".rpv-core__annotation--link a")
    .forEach((link) => {
      if ((link as HTMLAnchorElement).href)
        link.setAttribute("target", "_blank");
    });
}
