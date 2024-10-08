// React
import { useContext } from "react";

// Local
import { PostingDataContext } from "App";
import { Link } from "react-router-dom";
import { EachPosting } from "model/posting-data";
import "pages/body/PostingList.css";

// External

function PostingList() {
  const postingData = useContext(PostingDataContext);

  return (
    <div className="posting-list-wrap">
      {postingData &&
        postingData.getCategoryList().map((category: string) => (
          <div key={`category-${category}`} className="category-wrap">
            <h2 className="category-title">{category}</h2>
            <ul className="posting-link-wrap">
              {postingData
                .getPostingList(category)
                .map((posting: EachPosting) => (
                  <li key={`posting-${posting.title}`}>
                    <Link
                      to={posting.path}
                      className="posting-link-item"
                      aria-label={`A post named ${posting.title} in the ${posting.category} category`}
                    >
                      <span>{posting.title}</span>
                      <span>{posting.date}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
    </div>
  );
}

export default PostingList;
