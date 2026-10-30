import React, { useEffect, useState } from "react";
import axios from "axios";
import EthImage from "../images/ethereum.svg";
import { Link, useParams } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";
import nftImage from "../images/nftImage.jpg";
import Skeleton from "../components/UI/Skeleton";

const ItemDetails = () => {
  const { nftId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    let active = true;

    const fetchItem = async () => {
      if (!nftId) {
        setError("No item ID was provided.");
        setLoading(false);
        setItem(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails",
          { params: { nftId } }
        );
        if (active) setItem(response.data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchItem();

    return () => {
      active = false;
    };
  }, [nftId]);

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                {loading ? (
                  <Skeleton width="100%" height="450px" borderRadius="8px" />
                ) : error ? null : (
                  <img
                    src={item?.nftImage || nftImage}
                    className="img-fluid img-rounded mb-sm-30 nft-image"
                    alt={item?.title || "NFT"}
                  />
                )}
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  {loading ? (
                    <>
                      <Skeleton width="75%" height="32px" />
                      <div className="item_info_counts">
                        <Skeleton width="50px" height="18px" />
                        <Skeleton width="50px" height="18px" />
                      </div>
                      <Skeleton width="100%" height="60px" />
                      <div className="item-author-list">
                        <div className="item-author-entry">
                          <Skeleton width="45px" height="16px" />
                          <div className="item_author">
                            <div className="author_list_pp">
                              <Skeleton width="50px" height="50px" borderRadius="50%" />
                            </div>
                            <div className="author_list_info">
                              <Skeleton width="110px" height="16px" />
                            </div>
                          </div>
                        </div>
                        <div className="item-author-entry">
                          <Skeleton width="50px" height="16px" />
                          <div className="item_author">
                            <div className="author_list_pp">
                              <Skeleton width="50px" height="50px" borderRadius="50%" />
                            </div>
                            <div className="author_list_info">
                              <Skeleton width="110px" height="16px" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="de_tab tab_simple">
                        <Skeleton width="45px" height="16px" />
                        <div className="nft-item-price">
                          <Skeleton width="60px" height="20px" />
                        </div>
                      </div>
                    </>
                  ) : error ? (
                    <div role="alert">Could not load item: {error}</div>
                  ) : item ? (
                    <>
                      <h2>
                        {item.title}
                        {item.tag != null ? ` #${item.tag}` : ""}
                      </h2>
                      <div className="item_info_counts">
                        <div className="item_info_views">
                          <i className="fa fa-eye"></i>
                          {item.views}
                        </div>
                        <div className="item_info_like">
                          <i className="fa fa-heart"></i>
                          {item.likes}
                        </div>
                      </div>
                      <p>{item.description}</p>
                      <div className="item-author-list">
                        <div className="item-author-entry">
                          <h6>Owner</h6>
                          <div className="item_author">
                            <div className="author_list_pp">
                              <Link to={`/author/${item.ownerId}`}>
                                <img
                                  className="lazy"
                                  src={item.ownerImage || AuthorImage}
                                  alt={item.ownerName || "Owner"}
                                />
                                <i className="fa fa-check"></i>
                              </Link>
                            </div>
                            <div className="author_list_info">
                              <Link to={`/author/${item.ownerId}`}>
                                {item.ownerName}
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="item-author-entry">
                          <h6>Creator</h6>
                          <div className="item_author">
                            <div className="author_list_pp">
                              <Link to={`/author/${item.creatorId}`}>
                                <img
                                  className="lazy"
                                  src={item.creatorImage || AuthorImage}
                                  alt={item.creatorName || "Creator"}
                                />
                                <i className="fa fa-check"></i>
                              </Link>
                            </div>
                            <div className="author_list_info">
                              <Link to={`/author/${item.creatorId}`}>
                                {item.creatorName}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="de_tab tab_simple">
                        <div className="spacer-40"></div>
                        <h6>Price</h6>
                        <div className="nft-item-price">
                          <img src={EthImage} alt="ETH" />
                          <span>{item.price}</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
