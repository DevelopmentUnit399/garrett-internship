import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import axios from 'axios'
import Skeleton from "../UI/Skeleton";
import ReactOwlCarousel from "react-owl-carousel";

const TopSellers = () => {

  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get('https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers')
        setSellers(response.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSellers()
  }, [])

  return (
    <section
      id="section-popular"
      className="pb-5"
      data-aos="fade"
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            <ol className="author_list">
              {loading
                ? Array.from({ length: 12 }, (_, index) => (
                  <li key={`skeleton-${index}`}>
                    <div className="author_list_pp">
                      <Skeleton width="50px" height="50px" borderRadius="50%" />
                    </div>
                    <div className="author_list_info">
                      <div>
                        <Skeleton width="100%" height="16px" />
                      </div>
                      <div>
                        <Skeleton width="45%" height="16px" />
                      </div>
                    </div>
                  </li>
                ))
              : error
                ? <div className="item" role="alert">Coult not load Sellers: {error}</div>
                : sellers.map((item, index) => (
                  <li key={item.id || item.authorId || index}>
                      <div className="author_list_pp">
                        <Link to={`/author/${item.authorId}`}>
                          <img
                            className="lazy pp-author"
                            src={item.authorImage || AuthorImage}
                            alt={item.authorName}
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      <div className="author_list_info">
                        <Link to={`/author/${item.authorId}`}>{item.authorName}</Link>
                        <span>{item.price} ETH</span>
                      </div>
                    </li>
                ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
