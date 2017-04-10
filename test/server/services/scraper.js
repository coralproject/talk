describe('services.scraper', () => {
  describe('#create', () => {
    it('should create a new kue job');
  });

  describe('#scrape', () => {
    it('should scrape complete information');
    it('should scrape what it can');
  });

  describe('#update', () => {
    it('should update the database record entries from the meta');
  });

  describe('#process', () => {
    it('should start the processor to scrape assets');
  });

  describe('#shutdown', () => {
    it('should shutdown the job processor');
  });
});
