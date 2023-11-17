# in5320-DHIS2
## Documentation
Group-18 members:
- Ilmi Jusufi (ilmij@ifi.uio.no)
- Uvejs Sadiki (uvejss@ifi.uio.no)
- Per Tinius Fremstad-Waldron (pertfr@ifi.uio.no)

# Functionality

## Dashboard
The application is designed for store managers in Whotopia to easily manage and track medical commodity inventory. The user is greeted with a dashboard that provides a countdown to next restock, which commodities are critical low and all the information the store manager needs for each commodity.

## Dispense/Stock Up 
With the Dispense/Stock Up feature, store managers can efficiently handle dispensing requests and add new stock to the inventory, and monitor the status of each commodity whether it is classified as healthy, moderate, or critical, of potential stock-out. 

## Nearby Units
The Nearby Units feature shows clinics that are in the same health district and shows their stock inventory and contact information to request from.

## History
The History section offers a detailed overview of past dispensing transactions and recounts where the the user can filter after date. For corrections, the 

## Stock Recount
Stock Recount feature enables manual adjustments, ensuring digital inventory aligns with physical counts.

# Technology Stack

## React
We harnessed the power of React, a popular JavaScript library for building user interfaces. React's component-based architecture allowed us to create a modular and scalable project structure.

## DHIS2 API
The DHIS2 API played a pivotal role in our project, serving as the gateway for fetching and updating data. We utilized the API to retrieve information on commodities and seamlessly update the dataset as needed.

# Code Structure

## Component Structure
To enhance maintainability and readability, we structured our code into organized folders. Each major functionality, such as data management and the dashboard, has its dedicated folder. This approach helps in isolating concerns and simplifying debugging and collaboration.

## Logic Breakdown
Within these folders, we further segmented the logic into smaller, manageable components. This not only facilitates a more granular understanding of the code but also promotes code reusability. For instance, we have separate components for data management and the dashboard, each containing smaller components.

## ActivePage Logic
Drawing inspiration from the logic employed in oblig3, we adopted a consistent approach throughout the project. This uniformity aids in maintaining a coherent codebase, making it easier for developers to navigate and contribute.

## Common Utilities
Recognizing the need for shared functionality, we created a dedicated folder for common utilities. These utilities serve multiple components and ensure consistency across the application.

# Application Workflow
## Data Fetching
The application follows a streamlined workflow. We initiate a one-time data fetch from the API in the dashboard.js file to avoid unnecessary data queries. Once fetched, subsequent components leverage this saved data for their operations.

## Data Manipulation
Other components utilize mutate queries to modify the data stored in the application or send new data to the data store through the API. This approach optimizes efficiency by reducing redundant data fetching and ensures that the application works seamlessly with the most up-to-date information.

In conclusion, our project stands as a testament to the effective integration of React and the DHIS2 API. The meticulous organization of code into modular components and the strategic use of data fetching and mutation queries contribute to a robust and scalable application.

# Missing functionality/implementation
While our current implementation showcases a solid foundation, there are notable areas where additional functionality and optimization could enhance the application's utility.

## Stock Level Prediction:
While our current stock monitoring has a basic framework, it lacks predictive capabilities. Enhancing our monitoring system with predictive analytics will enable store managers to anticipate stock needs, minimizing the risk of shortages. This improvement aligns with industry best practices and enhances the overall effectiveness of our stock management solution.

## Sandbox Mode:
To cater to diverse user profiles, the implementation lacks a sandbox or training mode. This feature would allow users to test application workflows, providing a risk-free environment for experimentation.

## Offline Features:
Recognizing the challenges posed by intermittent internet connectivity, the application currently lacks offline support. Developing essential stock management workflows for offline use, while ensuring data integrity, would enable users to continue their work seamlessly during periods of connectivity loss. 

## Analytics Dashboard:
The absence of an analytics dashboard is another notable gap. Implementing a dashboard with visualizations such as graphs, tables, charts, or maps would enable users to discover trends and patterns in commodity consumption.


</details>
