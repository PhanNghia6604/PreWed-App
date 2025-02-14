import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { blog } from '../../fake data/data'
import styles from './BlogDetail.module.css'

export const BlogDetail = () => {
    const [showMore, setShowMore] = useState(false);
  const { id } = useParams()
  const item = blog.find((post) => post.id === Number(id))

  if (!item) return <h2>Blog not found</h2>

  return (
    <div className={styles.container}>
      <div className={styles.img}>
        <img src={item.cover} alt={item.title} />
      </div>
      <h1 className={styles.title}>{item.title}</h1>
      <p className={styles.meta}>
        <strong>By:</strong> {item.author} | <strong>Date:</strong> {item.date}
      </p>
      <p className={styles.desc}>
        {showMore ? item.desc : item.desc.slice(0,300) + "..."}
        <button className={styles.readMoreBtn} onClick={() => setShowMore(!showMore)}>
            {showMore ? "Thu gọn" : "Xem thêm"}
        </button>
      </p>
    </div>
  )
}
