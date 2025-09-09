import { useMemo } from 'react';
import { Pagination as Paginate, PaginationItem, PaginationLink } from 'reactstrap';

interface PaginationInterface {
  page: number;
  pages: number;
  pagesSize: number;
  goTo: Function
}

const Pagination = ({ page, pages, pagesSize, goTo }: PaginationInterface) => {
  const pagesList = useMemo(() => new Array(pages).fill(null).map((_, i) => i + 1), [pages]);
  const pageGroups = useMemo(() => {
    const group = [];
    let i = 0;
    for (const p of pagesList) {
      if (!group[i]) {
        group[i] = [];
      }
      if (group[i].length === pagesSize) {
        i += 1;
        group[i] = [p];
      } else {
        group[i].push(p);
      }
    }
    return group;
  }, [pagesList, pagesSize]);
  const pageGroup = pageGroups.find(item => item.includes(page));
  const pageGroupIndex = pageGroups.findIndex(item => item.includes(page));
  if (!pageGroup) return null;

  const handlePage = (p: number) => (ev: any) => {
    ev.preventDefault();
    goTo(p);
  }

  return (
    <Paginate>
      <PaginationItem disabled={pageGroupIndex === 0} onClick={pageGroupIndex === 0 ? () => {} : handlePage(1)}>
        <PaginationLink first />
      </PaginationItem>
      <PaginationItem
        disabled={pageGroupIndex === 0}
        onClick={pageGroupIndex === 0 ? () => {} : handlePage(pageGroup[0] - 1)}
      >
        <PaginationLink previous />
      </PaginationItem>
      {pageGroup.map((p) => (
        <PaginationItem active={p === page} key={p}>
          <PaginationLink onClick={handlePage(p)}>
            {p}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem
        disabled={pageGroupIndex + 1 === pageGroups.length}
        onClick={pageGroupIndex + 1 === pageGroups.length ? () => {} : handlePage(pageGroup[pageGroup.length - 1] + 1)}
      >
        <PaginationLink next />
      </PaginationItem>
      <PaginationItem disabled={pageGroupIndex + 1 === pageGroups.length}>
        <PaginationLink onClick={pageGroupIndex + 1 === pageGroups.length ? () => {} : handlePage(pages)} last />
      </PaginationItem>
    </Paginate>
  );
}

export default Pagination;