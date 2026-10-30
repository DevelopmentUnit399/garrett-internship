import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import Countdown from "../home/Countdown";
import Skeleton from "../UI/Skeleton";

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [visibleItemsCount, setVisibleItemsCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl =
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore";
        const url = sortBy
          ? `${baseUrl}?filter=${encodeURIComponent(sortBy)}`
          : baseUrl;
        const response = await axios.get(url);
        setItems(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [sortBy]);

  return (
    <>
      <div>
        <select
          id="filter-items"
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value);
            setVisibleItemsCount(8);
          }}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      {loading
        ? Array.from({ length: 8 }, (_, index) => (
            <div
              key={`skeleton-${index}`}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              style={{ display: "block", backgroundSize: "cover" }}
            >
              <div className="nft__item">
                <div className="author_list_pp">
                  <Skeleton width="50px" height="50px" borderRadius="50%" />
                </div>
                <div className="de_countdown">
                  <Skeleton width="76px" height="14px" borderRadius="30px" />
                </div>

                <div className="nft__item_wrap">
                  <Skeleton width="100%" height="300px" borderRadius="8px" />
                </div>
                <div className="nft__item_info">
                  <h4>
                    <Skeleton width="65%" height="18px" />
                  </h4>
                  <div className="nft__item_price">
                    <Skeleton width="54px" height="16px" />
                  </div>
                  <div className="nft__item_like">
                    <Skeleton width="42px" height="14px" />
                  </div>
                </div>
              </div>
            </div>
          ))
        : error
          ? <div className="item" role="alert">Could not load items: {error}</div>
          : items.slice(0, visibleItemsCount).map((item, index) => (
              <div
                key={item.id || item.nftId || index}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
                style={{ display: "block", backgroundSize: "cover" }}
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link
                      to={`/author/${item.authorId}`}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title={`Creator ID: ${item.authorId}`}
                    >
                      <img
                        className="lazy"
                        src={item.authorImage || AuthorImage}
                        alt=""
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  <Countdown expiryDate={item.expiryDate} />

                  <div className="nft__item_wrap">
                    <div className="nft__item_extra">
                      <div className="nft__item_buttons">
                        <button>Buy Now</button>
                        <div className="nft__item_share">
                          <h4>Share</h4>
                          <a href="" target="_blank" rel="noreferrer">
                            <i className="fa fa-facebook fa-lg"></i>
                          </a>
                          <a href="" target="_blank" rel="noreferrer">
                            <i className="fa fa-twitter fa-lg"></i>
                          </a>
                          <a href="">
                            <i className="fa fa-envelope fa-lg"></i>
                          </a>
                        </div>
                      </div>
                    </div>

                    <Link to={`/item-details/${item.nftId}`}>
                      <img
                        src={item.nftImage || nftImage}
                        className="lazy nft__item_preview"
                        alt={item.title}
                      />
                    </Link>
                  </div>
                  <div className="nft__item_info">
                    <Link to={`/item-details/${item.nftId}`}>
                      <h4>{item.title}</h4>
                    </Link>
                    <div className="nft__item_price">{item.price} ETH</div>
                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

      {!loading && !error && visibleItemsCount < items.length && (
        <div className="col-md-12 text-center">
          <Link
            to=""
            id="loadmore"
            className="btn-main lead"
            onClick={(event) => {
              event.preventDefault();
              setVisibleItemsCount((count) => count + 4);
            }}
          >
            Load more
          </Link>
        </div>
      )}
    </>
  );
};

export default ExploreItems;
