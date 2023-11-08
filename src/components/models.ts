export interface IAmazonHistoricalTrend {
  pricing: {
    listPrice:
      | {
          price: number;
          timestamp: number;
        }[]
      | number[];

    buyBoxPrice: [];

    price: number[];
    timestamp: null;
  };
  ratings: {
    avgRatings: number[];
    ratingsCount: number[];
    sellersCount: {
      count: number;
      timestamp: number;
    }[];
  };
  categories: ICategory[];
}

export interface ICategory {
  name: string;
  rankings: [
    {
      rank: number;
      timestamp: number;
    }
  ];
  category_id: number;
}
