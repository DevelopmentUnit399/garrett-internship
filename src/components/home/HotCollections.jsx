import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import axios from 'axios';
import ReactOwlCarousel from "react-owl-carousel";
import Skeleton from "../UI/Skeleton";

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get('https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections');
        setCollections(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

            <div className="col-lg-12">
              <ReactOwlCarousel
                key={loading ? "loading" : "loaded"}
                className="owl-theme"
                loop={collections.length > 4}
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
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Skeleton width="100%" height="220px" />
                      </div>
                      <div className="nft_coll_pp">
                        <Skeleton width="60px" height="60px" borderRadius="50%" />
                      </div>
                      <div className="nft_coll_info">
                        <Skeleton width="70%" height="20px" />
                        <Skeleton width="35%" height="16px" />
                      </div>
                    </div>
                  </div>
                ))
                : error
                ? <div className="item" role="alert">Could not load collections: {error}</div>
                : collections.map((collection) => (
                  <div className="item" key={collection.id || collection.nftId}>
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Link to={`/item-details/${collection.nftId}`}>
                          <img src={collection.nftImage || nftImage} className="lazy img-fluid" alt="" />
                        </Link>
                      </div>
                      <div className="nft_coll_pp">
                        <Link to={`/author/${collection.authorId}`}>
                          <img className="lazy pp-coll" src={collection.authorImage || AuthorImage} alt="" />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>
                      <div className="nft_coll_info">
                        <Link to="/explore">
                          <h4>{collection.title}</h4>
                        </Link>
                        <span>ERC-{collection.code}</span>
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

export default HotCollections