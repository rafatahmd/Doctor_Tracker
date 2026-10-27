/**
 * APIFeatures - Reusable query helper for search, filter, date-range, and pagination
 * Usage: new APIFeatures(Model.find(), req.query).search().filter().dateRange().paginate()
 */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.totalCount = 0;
  }

  /**
   * Text search using MongoDB text index
   * Query param: ?search=keyword
   */
  search(fields = ['name']) {
    if (this.queryString.search) {
      const searchRegex = new RegExp(this.queryString.search, 'i');
      const searchConditions = fields.map(field => ({
        [field]: searchRegex
      }));
      this.query = this.query.find({ $or: searchConditions });
    }
    return this;
  }

  /**
   * Filter by specific fields
   * Query params: ?specialization=Cardiology&condition=Diabetes
   */
  filter(allowedFields = []) {
    const queryObj = { ...this.queryString };
    
    // Fields to exclude from filtering
    const excludedFields = ['page', 'limit', 'sort', 'search', 'fromDate', 'toDate', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Only filter by allowed fields
    const filterObj = {};
    allowedFields.forEach(field => {
      if (queryObj[field]) {
        filterObj[field] = queryObj[field];
      }
    });

    if (Object.keys(filterObj).length > 0) {
      this.query = this.query.find(filterObj);
    }

    return this;
  }

  /**
   * Date range filtering
   * Query params: ?fromDate=2024-01-01&toDate=2024-12-31
   */
  dateRange(dateField = 'createdAt') {
    const dateFilter = {};

    if (this.queryString.fromDate) {
      dateFilter.$gte = new Date(this.queryString.fromDate);
    }

    if (this.queryString.toDate) {
      // Set to end of day
      const toDate = new Date(this.queryString.toDate);
      toDate.setHours(23, 59, 59, 999);
      dateFilter.$lte = toDate;
    }

    if (Object.keys(dateFilter).length > 0) {
      this.query = this.query.find({ [dateField]: dateFilter });
    }

    return this;
  }

  /**
   * Sorting
   * Query param: ?sort=name,-createdAt (prefix with - for descending)
   */
  sort(defaultSort = '-createdAt') {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(defaultSort);
    }
    return this;
  }

  /**
   * Pagination
   * Query params: ?page=1&limit=10
   */
  paginate(defaultLimit = 10) {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || defaultLimit;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;

    return this;
  }

  /**
   * Get pagination info for response
   */
  getPaginationInfo(totalCount) {
    const totalPages = Math.ceil(totalCount / this.limit);
    return {
      currentPage: this.page,
      totalPages,
      totalCount,
      hasNextPage: this.page < totalPages,
      hasPrevPage: this.page > 1
    };
  }
}

module.exports = APIFeatures;
