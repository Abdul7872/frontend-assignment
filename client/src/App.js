import React, { useState } from "react";
import { Button, DatePicker, Form, Input, Spin, notification } from 'antd'
import moment from 'moment'
import axios from 'axios';
import './App.css';

function App() {
	const [stockData, setStockData] = useState();
	const [isLoading, setIsLoading] = useState(false);


	const onFinish = async ({symbol, date}) =>{
		setIsLoading(true);
		try {
			const reqBody = { symbol, date: date.format("YYYY-MM-DD") }
			const response = await axios.post('fetchStockData',reqBody);
			if(response.status === 200) setStockData(response?.data);
		} catch (error) {
			console.error('error', error)
			Toast('error', error?.response?.data?.error ?? error?.response?.data?.message ?? error?.message)
			setStockData()
		}finally{
			setIsLoading(false);
		}
	}


	return (
		<div className="main">
			<div>
				<h3>Get Stock Details(US market):</h3>
				<Form name="stock_form" onFinish={onFinish} layout="vertical" requiredMark={false}>
					<Form.Item
						label="Ticker Symbol:"
						name="symbol"
						rules={[ { required: true, message: 'Please input stock symbol!' } ]}
					>
					<Input 
						placeholder="e.g. AAPL,GOOGL,MSFT"
						// convert input to uppercase
						onInput={(e)=> e.target.value = e.target.value.toUpperCase()}
						//input only string, number and symbol not allow  
						onKeyDown={(event) => !/[A-Za-z\b]/.test(event.key) && event.preventDefault() } 
					/>
				</Form.Item>
				<Form.Item
					label="Date:"
					name="date"
					rules={[ { required: true, message: 'Please input a date!' } ]}
				>
					<DatePicker 
						className="w-100" 
						// disable today, saturday and sunday
						disabledDate={(current) => current > moment().startOf('day') || current.day() === 0 || current.day() === 6} 
					/>
				</Form.Item>

				<Form.Item noStyle>
					<Button disabled={isLoading} type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
			</div>
			{isLoading && <Spin size="large" />}
			{!isLoading && stockData && (
				<div className="stock_details">
					<h3>{stockData?.symbol} Performance on {moment(stockData?.from).format('MMMM Do YYYY')}:</h3>
					<div>
						<div className="stock_data"> <span>Open :</span> {stockData?.open}</div>
						<div className="stock_data"> <span>High :</span> {stockData?.high}</div>
						<div className="stock_data"> <span>Low :</span> {stockData?.low}</div>
						<div className="stock_data"> <span>Close :</span> {stockData?.close}</div>
						<div className="stock_data"> <span>Volume :</span> {stockData?.volume}</div>
					</div>
				</div>
			)}
		</div>
	);
}

const Toast = ( type, description, placement='top') => (
  notification[type]({
    description,
    placement
  })
)

export default App;