import { useState, useEffect } from 'react';

const PAGE_CELL_LIMIT = 12;

function Pagination({ pages, selectedPage, setSelectedPage }) {
    const generateCells = () => {
        const getClass = pageNr => {
            return pageNr === selectedPage ? 'active' : '';
        };

        const createCell = pageNr => {
            return (
                <li className={'page-item ' + getClass(pageNr)} key={pageNr}>
                    <a className="btn page-link" onClick={() => setSelectedPage(pageNr)}>
                        {pageNr}
                    </a>
                </li>
            );
        };

        const createGapCell = key => {
            return (
                <li className="page-item" key={key}>
                    <a className="btn page-link">...</a>
                </li>
            );
        };

        const cells = [];
        if (pages > PAGE_CELL_LIMIT) {
            cells.push(createCell(1));

            if (selectedPage < 7) {
                for (let i = 2; i <= 10; i++) {
                    cells.push(createCell(i));
                }
                cells.push(createGapCell('gap1'));
            } else if (selectedPage >= 7 && selectedPage < pages - 7) {
                cells.push(createGapCell('gap1'));
                for (let i = selectedPage - 4; i < selectedPage + 4; i++) {
                    cells.push(createCell(i));
                }
                cells.push(createGapCell('gap2'));
            } else if (selectedPage >= pages - 7) {
                cells.push(createGapCell('gap1'));
                for (let i = pages - 9; i < pages; i++) {
                    cells.push(createCell(i));
                }
            }
            cells.push(createCell(pages));
        } else {
            for (let i = 1; i <= pages; i++) {
                cells.push(createCell(i));
            }
        }

        return cells.map(r => r);
    };

    const setPreviousPage = () => {
        if (selectedPage === 1) {
            return;
        }
        setSelectedPage(selectedPage - 1);
    };

    const setNextPage = () => {
        if (selectedPage === pages) {
            return;
        }
        setSelectedPage(selectedPage + 1);
    };

    return (
        <div>
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className="page-item">
                        <a className="page-link btn" onClick={setPreviousPage}>
                            Previous
                        </a>
                    </li>
                    {generateCells()}
                    <li className="page-item">
                        <a className="page-link btn" onClick={setNextPage}>
                            Next
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Pagination;
