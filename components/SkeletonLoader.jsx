import React from 'react';
import './SkeletonLoader.css';

/**
 * Skeleton loader for content placeholders
 * @param {Object} props
 * @param {number} props.count - Number of skeleton items to render
 * @param {string} props.height - Height of skeleton (CSS value)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.width - Width of skeleton (CSS value, default: 100%)
 */
const SkeletonLoader = ({ 
  count = 1, 
  height = '20px',
  className = '',
  width = '100%'
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`skeleton-loader ${className}`}
          style={{ height, width }}
        />
      ))}
    </>
  );
};

/**
 * Card skeleton loader
 */
export const CardSkeleton = () => {
  return (
    <div className="card-skeleton">
      <SkeletonLoader height="24px" width="75%" className="skeleton-title" />
      <SkeletonLoader height="16px" count={2} className="skeleton-line" />
      <SkeletonLoader height="40px" width="50%" className="skeleton-button" />
    </div>
  );
};

/**
 * List item skeleton loader
 */
export const ListItemSkeleton = () => {
  return (
    <div className="list-item-skeleton">
      <div className="skeleton-avatar" />
      <div className="skeleton-content">
        <SkeletonLoader height="16px" width="60%" />
        <SkeletonLoader height="14px" width="40%" className="skeleton-subtitle" />
      </div>
    </div>
  );
};

/**
 * Table skeleton loader
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="table-skeleton">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="table-skeleton-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonLoader key={colIndex} height="20px" width="80%" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;




