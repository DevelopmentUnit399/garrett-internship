import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import axios from 'axios'
import ReactOwlCarousel from "react-owl-carousel";
import Skeleton from "../UI/Skeleton"

const Countdown = ({ expiryDate }) => {
  const expiryTime = Number(expiryDate);
  const hasExpiry = expiryDate != null && Number.isFinite(expiryTime);
  const [secondsRemaining, setSecondsRemaining] = useState(() =>
    hasExpiry ? Math.max(0, Math.ceil((expiryTime - Date.now()) / 1000)) : 0
  );

  useEffect(() => {
    if (!hasExpiry) {
      setSecondsRemaining(0);
      return;
    }

    const getRemainingSeconds = () =>
      Math.max(0, Math.ceil((expiryTime - Date.now()) / 1000));

    setSecondsRemaining(getRemainingSeconds());
    if (expiryTime <= Date.now()) return;

    const intervalId = window.setInterval(() => {
      const remaining = getRemainingSeconds();
      setSecondsRemaining(remaining);
      if (remaining === 0) window.clearInterval(intervalId);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [expiryTime, hasExpiry]);

  if (!hasExpiry) {
    return <div className="de_countdown">No expiry</div>;
  }

  if (secondsRemaining === 0) {
    return <div className="de_countdown">Expired</div>;
  }

  const days = Math.floor(secondsRemaining / 86400);
  const hours = Math.floor((secondsRemaining % 86400) / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;
  const countdownText = days > 0
    ? `${days}d ${hours}h ${minutes}m ${seconds}s`
    : `${hours}h ${minutes}m ${seconds}s`;

  return <div className="de_countdown">{countdownText}</div>;
};

const NewItems = () => {

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems')
        setItems(response.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <div className="col-lg-12">
            <ReactOwlCarousel
              key={loading ? "loading" : "loaded"}
              className="owl-theme"
              loop={items.length > 4}
              margin={24}
              nav
              dots
              responsive={{
                0: { items: 1 },
                600: { items: 2 },
                1000: { items: 4 },
              }}
            >
              {loading
                ? Array.from({ length: 4 }, (_, index) => (
                  <div className="item" key={`skeleton-${index}`}>
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
                  : items.map((item, index) => (
                    <div className="item" key={item.id || item.nftId || index}>
                      <div className="nft__item">
                        <div className="author_list_pp">
                          <Link
                            to={`/author/${item.authorId}`}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title={`Creator ID: ${item.authorId}`}
                          >
                            <img className="lazy" src={item.authorImage || AuthorImage} alt="" />
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
            </ReactOwlCarousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewItems;
