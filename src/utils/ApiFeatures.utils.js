class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query.sort(sortBy);
        } else {
            this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query.select(fields);
        } else {
            this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        this.page = this.queryString.page * 1 || 1;
        this.limit = this.queryString.limit * 1 || 30;

        const skip = (this.page - 1) * this.limit;

        this.query.skip(skip).limit(this.limit);

        return this;
    }
}

module.exports = APIFeatures;