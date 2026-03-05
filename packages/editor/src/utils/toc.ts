export type TOCItem = {
  level: number;
  title: string;
  id: string;
  top: number;
};

const levelsMap: Record<string, number> = {
  H1: 1,
  H2: 2,
  H3: 3,
  H4: 4,
  H5: 5,
  H6: 6
};

export function getTableOfContents(content: HTMLElement) {
  const tableOfContents: TOCItem[] = [];
  let level = -1;
  let prevHeading = 0;
  for (const heading of content.querySelectorAll<HTMLHeadingElement>(
    "h1, h2, h3, h4, h5, h6"
  )) {
    const title = heading.textContent;
    const id = heading.dataset.blockId;
    if (!id || !title) continue;
    const nodeName = heading.nodeName;
    const currentHeading = levelsMap[nodeName];

    level =
      prevHeading < currentHeading
        ? level + 1
        : prevHeading > currentHeading
        ? level - (prevHeading - currentHeading)
        : level;
    level = Math.max(0, level);
    prevHeading = currentHeading;

    tableOfContents.push({
      level,
      title,
      id,
      top: (heading as HTMLElement).offsetTop
    });
  }
  return tableOfContents;
}

export function scrollIntoViewById(blockId: string, optionalStyles = "") {
  const element = document.querySelector<HTMLElement>(
    `.active [data-block-id=${JSON.stringify(blockId)}]`
  );

  if (element) {
    const css = `.active [data-block-id=${JSON.stringify(blockId)}] {
    background-color: var(--shade) !important;
    ${optionalStyles}
}`;
    const stylesheet = document.createElement("style");
    stylesheet.innerText = css;
    document.head.appendChild(stylesheet);
    setTimeout(() => {
      stylesheet.remove();
    }, 5000);

    setTimeout(
      () =>
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start"
        }),
      100
    );
  }
}
