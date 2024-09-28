
# Advanced Task Optimization Calculator

## Overview

This app helps you assess whether automating a recurring task is beneficial based on multiple factors. It provides a holistic view by considering not just time savings but also the inconvenience, error potential, opportunity cost, and maintainability of manual tasks.

### Key Features:
- **Time Impact**: Calculates how much time you spend on the task over 5 years.
- **Inconvenience Factor**: Evaluates how disruptive the task is to your workflow.
- **Opportunity Cost**: Measures the potential value of time spent elsewhere.
- **Error Potential**: Assesses the likelihood of making mistakes.
- **Maintainability**: Considers how difficult it would be to maintain the automated solution.
- **Automation ROI**: Provides a clear recommendation based on the return on investment for automating the task.

## Workflow & Hosting

This app was developed using @vercel’s **v0.dev AI assistant** to write the code, but rather than hosting it directly with Vercel, I used **Open-Next** to port the app. After bootstrapping with Open-Next, the app was deployed to **Cloudflare Workers** using the Cloudflare adapter and Wrangler for deployment.

### My Workflow:
```
v0.dev -> Open-Next -> Cloudflare Workers
```

This approach avoids vendor lock-in while maintaining flexibility and ease of use.

## How It Works

### Algorithm:

The app calculates a "total impact" score to quantify the benefits of automation using the following formula:

```
Total Impact = Time Impact (5 years) + Inconvenience Impact + Opportunity Cost Impact + Error Potential Impact + Maintainability Impact
```

- **Time Impact**: Time spent on the task over 5 years.
- **Inconvenience Impact**: How disruptive the task is (based on your rating).
- **Opportunity Cost Impact**: Time you could spend on other activities.
- **Error Potential Impact**: Likelihood of errors.
- **Maintainability Impact**: Difficulty of maintaining the automated solution.

### Formula Details:
| Factor            | Weight | Formula                                                    |
|--------------------|--------|------------------------------------------------------------|
| **Inconvenience**  | 0.2    | Inconvenience Factor * 0.2 * Time Impact (5 years)          |
| **Opportunity Cost**| 0.2   | Opportunity Cost * 0.2 * Time Impact (5 years)             |
| **Error Potential**| 0.1    | Error Potential * 0.1 * Time Impact (5 years)              |
| **Maintainability**| 0.1    | (10 - Maintainability) * 0.1 * Time Impact (5 years)       |

#### Automation ROI:
```
Automation ROI = Total Impact / (Time to Automate in Hours * 60)
```
The app uses this ROI to recommend whether automation is **Strongly Recommended**, **Recommended**, or **Not Recommended**.

## Assumptions
- **Task Frequency**: The task is performed consistently over the 5-year period.
- **Subjective Ratings**: Inconvenience, opportunity cost, and error potential are user-rated.
- **Linear Impact**: The relationship between ratings and their impact on time is linear.

## Example Use Case

Let’s say you spend 10 minutes on a task daily, it’s very inconvenient (Inconvenience Factor = 7), and you estimate 30 hours to automate the task. The app will calculate:

1. **Time Impact (5 years)**:  
   `10 minutes * 365 days * 5 years = 18,250 minutes`
   
2. **Inconvenience Impact**:  
   `7 * 0.2 * 18,250 = 25,550 minutes`

3. **Opportunity Cost Impact**:  
   `...`

The app then sums up the impacts to compute **Total Impact** and provides an automation recommendation based on the **Automation ROI**.

## Saving Results

- **Save Results**: You can save your most recent calculations to your browser’s local storage.
- **Automatic Load**: When you revisit the app, your last saved results are automatically loaded.
- **No History**: Only the most recent result is saved.
