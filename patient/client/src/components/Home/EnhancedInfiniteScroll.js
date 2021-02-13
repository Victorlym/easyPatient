
import InfiniteScroll from "react-infinite-scroller";

class EnhancedInfiniteScroll extends InfiniteScroll {
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.pageStart !== this.props.pageStart) {
      this.pageLoaded = 0;
    }
    this.attachScrollListener();
  }
}

export default EnhancedInfiniteScroll;