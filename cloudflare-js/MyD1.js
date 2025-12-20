

export class MyD1 {
    constructor({ accountId, databaseId, apiToken }) {
        this.accountId = accountId;
        this.databaseId = databaseId;
        this.apiToken = apiToken;
        this.baseUrl = "https://api.cloudflare.com/client/v4";
    }

    /**
     * Execute a SQL query
     * @param {string} sql - SQL statement
     * @param {Array} params - SQL parameters
     * @returns {Promise<Array>} Query result
     */
    async queryAsync(sql, params = []) {
        const body = {
            sql,
            params,
        };

        return this._executeQueryAsync(body);
    }

    /**
     * Execute batch SQL queries
     * @param {string} sql - SQL statement
     * @param {Array<Array>} params - INSERT INTO users(name, age) VALUES(?, ?); [[Alice, 30], [Bob, 25]]
     * @returns {Promise<Array>} Array of query results
     */
    async batchAsync(sql, params = [[]]) {
        const body = {
            batch: params.map(paramSet => ({ sql, params: paramSet })),
        };

        return this._executeQueryAsync(body);
    }

    /**
     * Execute the query request
     * @private
     * @param {Object} body - Request body
     * @returns {Promise<Array<Object>>} Query results
     */
    async _executeQueryAsync(body) {
        const url = `${this.baseUrl}/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`D1 API error: ${response.status} ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(`Query failed: ${JSON.stringify(data.errors || data)}`);
            }

            return data.result[0].results;
        } catch (err) {
            throw new Error(`queryAsync failed: ${err.message}`);
        }
    }



};









