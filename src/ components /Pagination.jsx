function Pagination ({ pageInfo , handlePageChenge }) {
    return (
        // 第四週主線任務：分頁元件模板版型放置處
        <div className="d-flex justify-content-center mt-5">
            <nav>
            <ul className="pagination">
                
                <li className={`page-item ${!pageInfo.has_pre && 'disabled'}`}>
                <a onClick={()=> handlePageChenge(pageInfo.current_page - 1)}  className="page-link" href="#">
                    上一頁
                </a>
                </li>

                {/* 頁碼生成：透過 Array.from ＋map渲染的方式：將對應的長度的陣列(頁碼)印出，要記得加上key */}
                { Array.from({length:pageInfo.total_pages}) .map((_,index)=>(
                    <li key={index} className={`page-item ${pageInfo.current_page === index + 1  && 'active'}`}>
                    {/* 取得前頁面資料的判斷式條件 */}
                    <a onClick={()=> handlePageChenge(index + 1)} className="page-link" href="#">
                    {/* 在頁碼處帶上:因為index 是從0開始，所以用+1方式，讓頁碼從 1 開始做顯示 */}
                    { index + 1 }
                    </a>
                </li>
                ))}

                <li className={`page-item ${!pageInfo.has_next && 'disabled'}`}>
                <a onClick={()=> handlePageChenge(pageInfo.current_page+1) } className="page-link" href="#">
                    下一頁
                </a>
                </li>
            </ul>
            </nav>
        </div>
    )

}

export default Pagination;